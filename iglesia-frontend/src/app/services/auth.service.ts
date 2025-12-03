import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Hardcoded credentials (for demo purposes)
  private readonly credentials = {
    admin: { password: 'admin123', role: 'admin' as const },
    editor: { password: 'editor123', role: 'editor' as const }
  };

  constructor() {
    // Check if user is already logged in (from sessionStorage)
    this.restoreSession();
  }

  login(username: string, password: string): boolean {
    const cred = this.credentials[username as keyof typeof this.credentials];
    if (cred && cred.password === password) {
      const user: User = {
        id: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@iglesia.local`,
        role: cred.role
      };
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    sessionStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private restoreSession(): void {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        sessionStorage.removeItem('currentUser');
      }
    }
  }
}
