import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.authenticationUrl;
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateLoading(statusLoading: boolean) {
    this.loadingSubject.next(statusLoading);
  }

  getToken(email: string, token: string): Observable<any> {
    let headers = new HttpHeaders().set("Content-Type", "application/json"); // create header object
    headers = headers.append("Token", token);
    const data = {
      data: {
        "jwt-email": email,
      },
    };
    return this.http.post<any>(this.apiUrl, data, { headers: headers });
  }
}
