import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginAuthentication } from '../../services/login-authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showSearchComponent: boolean = false;
  searchText: string = '';

  constructor(private router: Router,
              private loginAuthService: LoginAuthentication) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.router.url.includes('/search')) {
        this.resetSearch();
      }
    });
  }

  toggleSearchComponent(): void {
    this.showSearchComponent = !this.showSearchComponent;
    const url = this.showSearchComponent ? '/search' : '/home';
    this.router.navigateByUrl(url);
  }

  closeSearch(): void {
    this.resetSearch();
    this.router.navigateByUrl('/home');
  }

  private resetSearch(): void {
    this.searchText = '';
    this.showSearchComponent = false;
  }

  getProfileRouterlink(): Observable<string> {
    return this.loginAuthService.isLoggedIn$.pipe(
      map((isLoggedIn: boolean) => (isLoggedIn ? '/profile': '/login'))
    );
  }
}