import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AdminMinisteriosComponent } from '../../components/admin-ministerios/admin-ministerios.component';
import { AdminEventosComponent } from '../../components/admin-eventos/admin-eventos.component';
import { AdminContactoComponent } from '../../components/admin-contacto/admin-contacto.component';
import { AdminHomeComponent } from '../../components/admin-home/admin-home.component';
import { AdminDiasReunionComponent } from '../../components/admin-dias-reunion/admin-dias-reunion.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminHomeComponent, AdminMinisteriosComponent, AdminEventosComponent, AdminContactoComponent, AdminDiasReunionComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  sidebarOpen = false;
  activeSection = 'home';
  hasChanges = false;
  publishSuccess = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.dataService.hasChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasChanges => {
        this.hasChanges = hasChanges;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  selectSection(section: string): void {
    this.activeSection = section;
    this.sidebarOpen = false;
  }

  publishChanges(): void {
    this.dataService.publishChanges();
    this.publishSuccess = true;
    setTimeout(() => {
      this.publishSuccess = false;
    }, 3000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
