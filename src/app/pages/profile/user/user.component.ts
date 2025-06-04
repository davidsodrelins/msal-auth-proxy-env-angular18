import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { imports } from "../user.imports";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [imports],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnInit {
  user: any = "";
  email = "";

  constructor(
    private messageService: MessageService,
    private msalService: MsalService,
    private router: Router
  ) {}

  ngOnInit() {
    if(this.msalService.instance.getAllAccounts().length > 0) {
      this.user = this.msalService.instance.getAllAccounts()[0].username;
      this.email = this.msalService.instance.getAllAccounts()[0].username;
    }else{
      this.router.navigate(["/login"]);
    }
    this.messageService.add({
      severity: "success",
      summary: "User authenticated successfully",
      detail: `Welcome, ${this.user}`,
    });

  }
}
