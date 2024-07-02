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
  pageWithoutHeader = [
    '/login',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
  ];
  
  constructor(private router: Router, 
              private loginAuthService: LoginAuthentication) {}
  
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
  
      this.showHeaderFooter = !this.pageWithoutHeader
          .some(url => this.router.url.startsWith(url));
  
      this.isLoginOrSignupRoute = ['/login', '/sign-up']
          .includes(this.router.url);
    });
  
    // Check authentication status
    this.loginAuthService.checkAuthentication();
  }
}
