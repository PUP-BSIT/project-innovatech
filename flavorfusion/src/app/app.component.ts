import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginAuthentication } from '../services/login-authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public showHeaderFooter: boolean = true;
  public isLoginOrSignupRoute: boolean = false;

  constructor(private router: Router, 
      private loginAuthService: LoginAuthentication) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = 
          !this.router.url.includes('/login') && 
          !this.router.url.includes('/sign-up');

        this.isLoginOrSignupRoute = 
          this.router.url.includes('/login') || 
          this.router.url.includes('/sign-up');
      }
    });

    // Check authentication status
    this.loginAuthService.checkAuthentication();
  }
}
