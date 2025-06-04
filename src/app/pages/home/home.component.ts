import { Component, OnInit } from "@angular/core";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from "@azure/msal-browser";
import { MessageService, MenuItem } from "primeng/api";
import { filter } from "rxjs/operators";
import { ImportsModule } from "../../imports";
import { imports } from "./home.imports";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  imports: [imports, ImportsModule],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  loginDisplay = false;
  activeItem: MenuItem | undefined;
  items: MenuItem[] | undefined;
  cururl = "";
  headquarters: any = [];
  selectedHeadQuarters!: string;
  loadingHeadQuarters = false;
  branchs: {}[] = [{}];
  loadingBranchs = false;
  selectedBranch!: string[];

  private routeSub!: Subscription;

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {
    this.cururl = router.url;
  }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    this.goToOptionSelection(this.router.url);

    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.goToOptionSelection(event.url);
      }
    });

  }



  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  goToFeatureSelection() {
    this.router.navigate(["feature-selection"]);
  }

  goToOptionSelection(url: string) {
    let currentRoute = "";
    url = this.router.url;
    if (url.startsWith("/home/users")) {
      this.items = [
        {
          id: "users",
          label: "Users",
          route: "profile/user",
        },
      ];
      currentRoute = url.replace("/home/", "");
      this.activeItem = this.items.find((x) => {
        return x["route"] == currentRoute;
      });
    }
  }
}
