import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { Observable } from "rxjs";

export const accessControlGuard: CanActivateFn = (route, state) => {
  const authService = inject(MsalService);
  const router = inject(Router);
  return new Observable<boolean>((observer) => {
    if (authService.instance.getAllAccounts().length > 0) {
      observer.next(true);
    } else {
      router.navigate(["/login"]);
      observer.next(false);
    }
    observer.complete();
  });
};
