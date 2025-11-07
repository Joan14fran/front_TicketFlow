import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'client' | 'agent';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = '/api/users';
  private tokenKey = 'auth_token';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor() {
    this.checkAuthStatus();
  }
  
  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }
  
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }
  
  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
  
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
  
  hasToken(): boolean {
    return !!this.getToken();
  }
  
  checkAuthStatus(): void {
    this.isAuthenticatedSubject.next(this.hasToken());
  }
  
  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Token ${token}` } : {};
  }
}