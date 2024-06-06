import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public showHeaderFooter: boolean = true;
  public isLoginOrSignupRoute: boolean = false;

  constructor(private router: Router) {}

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
  }
}