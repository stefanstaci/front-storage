import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:7080/api/auth/login', { login, password })
      .pipe(
        tap((response: any) => {
          this.setToken(response.token);
          localStorage.setItem('token', response.token);
        })
      );
  }

  logout(): Observable<any> {
    if (!this.isAuthenticated()) {
      throw new Error('User is not authenticated');
    }
    return this.http.put('http://localhost:7080/api/logout', {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  makeAuthenticatedRequest<T>(url: string, body?: any): Observable<T> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<T>(url, body, { headers });
  }
}
