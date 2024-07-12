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
    '/forgot_password',
    '/reset_password',
  ];
  
  constructor(private router: Router, 
              private loginAuthService: LoginAuthentication) {}
  
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

        this.showHeaderFooter = !this.pageWithoutHeader
            .some(url => event.url.startsWith(url));

        this.isLoginOrSignupRoute = ['/login', '/sign-up']
            .includes(event.url);  
    });
    this.loginAuthService.checkAuthentication();
  }
}
