import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Inject
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

// MSAL
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration
} from '@azure/msal-angular';
import {
  
  InteractionStatus,
  EventMessage,
  EventType,
  AuthenticationResult
} from '@azure/msal-browser';

// RxJS
import { Subject, Subscription, interval } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// PrimeNG

import { PrimeNGConfig } from 'primeng/api';

// i18n
import { AuthService } from './services/auth.service';
import { ImportsModule } from './imports';

// Serviços internos


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImportsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-frontend';

  /**  ─── Controle de sessão ─────────────────────────── */
  expiresOn!: Date;
  countdown!: string;
  toExpireVisible = false;
  expiredVisible = false;
  private tick$!: Subscription;

  /**  ─── Helpers ─────────────────────────────────────── */
  isIframe = false;
  loginDisplay = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private guardCfg: MsalGuardConfiguration,
    private msal: MsalService,
    private authIht: AuthService,
    private msalEvents: MsalBroadcastService,
    private router: Router,
  ) {
    

    /** cronômetro de expiração */
    this.expiresOn = this.nextExpiry();
    this.startCountdown();
    this.addActivityListeners();
  }

  /* ─────────────  ciclo de vida  ───────────── */
  ngOnInit(): void {
   

    /** fluxo MSAL de redirecionamento */
    this.authIht.updateLoading(false);
    this.msal.handleRedirectObservable().subscribe({
      next: (res?: AuthenticationResult) => {
        if (!res) { return; }
        this.msal.instance.setActiveAccount(res.account);
        this.setTokenRefreshTimeout(res.expiresOn);

        this.authIht
          .getToken(res.account!.username, res.accessToken)
          .subscribe({
            next: data => {
              localStorage.setItem('token', data.data.authorization.tokens.jwt);
              this.authIht.updateLoading(false);
              this.router.navigate(['/feature-selection']);
            },
            error: () => this.authIht.updateLoading(false)
          });
      },
      error: err => {
        this.authIht.updateLoading(false);
        console.error(err);
      }
    });

    /** eventos de conta adicionada/removida */
    this.msalEvents.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.ACCOUNT_ADDED ||
          msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe(() => {
        if (this.msal.instance.getAllAccounts().length === 0) {
          this.router.navigate(['/login']);
        } else {
          this.setLoginDisplay();
        }
      });

    /** progresso de interação MSAL */
    this.msalEvents.inProgress$
      .pipe(
        filter((s: InteractionStatus) => s === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.ensureActiveAccount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tick$?.unsubscribe();
  }

  /* ─────────────  sessão / contagem regressiva  ───────────── */
  private nextExpiry(): Date {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 40);   // 40 min
    return d;
  }

  private startCountdown(): void {
    this.tick$?.unsubscribe();
    this.tick$ = interval(1000).subscribe(() => {
      const now = Date.now();
      const left = this.expiresOn.getTime() - now;

      if (left <= 0) {
        this.countdown = '00:00';
        this.toExpireVisible = false;
        this.expiredVisible = true;
        this.tick$!.unsubscribe();
        return;
      }

      const min = Math.floor(left / 1000 / 60) % 60;
      const sec = Math.floor(left / 1000) % 60;
      this.countdown = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
      this.toExpireVisible = left <= 5 * 60 * 1000;  // < 5 min
      this.expiredVisible = false;
    });
  }

  private setTokenRefreshTimeout(expiresOn: Date | null): void {
    if (!expiresOn) { return; }

    const delay = expiresOn.getTime() - Date.now() - 5 * 60 * 1000;
    setTimeout(() => this.refreshToken(), delay);
  }

  private refreshToken(): void {
    const account = this.msal.instance.getAllAccounts()[0];
    this.msal.instance.acquireTokenSilent({ scopes: ['user.read'] })
      .then(r => {
        this.setTokenRefreshTimeout(r.expiresOn);
        return this.authIht.getToken(account.username, r.accessToken).toPromise();
      })
      .then(data => {
        if (data) { localStorage.setItem('token', data.data.authorization.tokens.jwt); }
      })
      .catch(console.error);
  }

  /* ─────────────  login / logout  ───────────── */
  logout(): void {
    this.resetExpiryBtn();
    this.msal.logoutRedirect();
  }

  redirectToLogin(): void {
    this.resetExpiryBtn();
    this.router.navigate(['/login']);
  }

  /* ─────────────  helpers  ───────────── */
  private setLoginDisplay(): void {
    this.loginDisplay = this.msal.instance.getAllAccounts().length > 0;
  }

  private ensureActiveAccount(): void {
    if (!this.msal.instance.getActiveAccount() &&
        this.msal.instance.getAllAccounts().length > 0) {
      this.msal.instance.setActiveAccount(this.msal.instance.getAllAccounts()[0]);
    }
  }

  @HostListener('document:click')
  @HostListener('document:keydown')
  resetExpiry(): void {
    if (!this.expiredVisible && !this.toExpireVisible) {
      this.expiresOn = this.nextExpiry();
      this.startCountdown();
    }
  }

  resetExpiryBtn(): void {
    this.expiresOn = this.nextExpiry();
    this.startCountdown();
  }

  private addActivityListeners(): void {
    document.addEventListener('click',  this.resetExpiry.bind(this));
    document.addEventListener('keydown', this.resetExpiry.bind(this));
  }
}
