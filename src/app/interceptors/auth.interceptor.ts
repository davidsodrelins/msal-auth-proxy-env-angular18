import { HttpInterceptorFn } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { inject } from '@angular/core';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const urlsToCheck = [
    environment.apiUrl,
    environment.apiConUrl,
    environment.apiDonwUrl,
    environment.authorizationUrl
  ];
  
  if (urlsToCheck.some(url => req.url.includes(url))) {
    const authService = inject(MsalService);
    let headersSeted = req.headers.set('Authorization',`Bearer ${localStorage.getItem("token")}`)
    headersSeted = headersSeted.set('jwt-email', authService.instance.getAllAccounts()[0].username)
    const reqWithHeader = req.clone({
      headers: headersSeted,
    });
    return next(reqWithHeader);
  }else{
    return next(req);
  }
};