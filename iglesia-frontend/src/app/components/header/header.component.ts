import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  isMenuOpen = false;
  // control which logo is visible; start showing 'El Vive (Blanco).png'
  showFirstLogo = true;
  private _logoInterval: any = null;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngAfterViewInit(): void {
    // Toggle logos every 20 seconds
    this._logoInterval = setInterval(() => {
      this.showFirstLogo = !this.showFirstLogo;
    }, 20000);
  }

  ngOnDestroy(): void {
    if (this._logoInterval) {
      clearInterval(this._logoInterval);
      this._logoInterval = null;
    }
  }
  
}
