import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña.';
      return;
    }

    this.isLoading = true;
    // Simulate network delay
    setTimeout(() => {
      if (this.authService.login(this.username, this.password)) {
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos. Intenta con "admin"/"admin123" o "editor"/"editor123".';
      }
      this.isLoading = false;
    }, 500);
  }
}
