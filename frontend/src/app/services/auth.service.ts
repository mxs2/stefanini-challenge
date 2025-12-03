import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  isAuthenticated = signal(false);

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const expiry = this.getTokenExpiry();

    if (token && expiry) {
      const now = new Date().getTime();
      if (now < expiry) {
        this.isAuthenticated.set(true);
      } else {
        this.clearAuth();
      }
    }
  }

  setToken(token: string, expiresIn?: number): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    // Se não informado, define expiração para 15 minutos
    const expiryTime = expiresIn
      ? new Date().getTime() + (expiresIn * 1000)
      : new Date().getTime() + (15 * 60 * 1000);

    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.isAuthenticated.set(false);
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    const expiry = this.getTokenExpiry();

    if (!token || !expiry) {
      return false;
    }

    return new Date().getTime() < expiry;
  }
}
