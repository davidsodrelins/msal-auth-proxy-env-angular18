import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(MsalService); 
  const router = inject(Router);
  if (authService.instance.getAllAccounts().length === 0 || localStorage.getItem("token") == null) {
    return router.navigate(["/login"]);
  }else{
    return true;
  }
};
