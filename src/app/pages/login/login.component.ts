import { Component } from "@angular/core";
import { ImportsModule } from "../../imports";
import { MessageService } from "primeng/api";
import { MsalService } from "@azure/msal-angular";
import { AuthService } from "../../services/auth.service";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ImportsModule, ButtonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [MessageService],
})
export class LoginComponent {
  errorMessage: string = "";
  loading = true;

  constructor(
    private msalService: MsalService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.loading$.subscribe((loadingStatus) => {
      this.loading = loadingStatus;
    });
  }g

  loginRedirect() {
    this.msalService.loginRedirect();
    this.router.navigate(['/feature-selection']);

  }
}
