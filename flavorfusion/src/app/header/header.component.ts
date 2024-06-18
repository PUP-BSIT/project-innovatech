import { Component, OnInit, ViewChild, ElementRef, viewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { LoginAuthentication } from '../../services/login-authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showSearchComponent: boolean = false;
  searchText: string = '';
  isSearchMode: boolean = false;

  isLoggedIn$: Observable<boolean>;
  loginLogoutText: string = 'Log In';
  isShown: boolean = false;

  constructor(
    private router: Router, 
    private loginAuthService: LoginAuthentication) {
      this.isLoggedIn$ = this.loginAuthService.isLoggedIn$;
    }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.router.url.includes('/search')) {
        this.resetSearch();
      }
      this.getLoginLogoutText();
    });
  }

  toggleSearchComponent(): void {
    this.showSearchComponent = !this.showSearchComponent;
    this.isSearchMode = false;
    if (this.showSearchComponent) {
      this.router.navigateByUrl('/search');
    }
  }

  closeSearch(): void {
    this.resetSearch();
    this.router.navigateByUrl('/home');
  }

  private resetSearch(): void {
    this.searchText = '';
    this.showSearchComponent = false;
    this.isSearchMode = false;
  }

  onSearch(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const trimmedQuery = this.searchText.trim();
    if (trimmedQuery) {
      this.router.navigate(['/search-recipe'], { queryParams: { query: trimmedQuery } });
    }
  }

  getProfileRouterlink(): Observable<string> {
    return this.loginAuthService.isLoggedIn$.pipe(
      map((isLoggedIn: boolean) => (isLoggedIn ? '/profile': '/login'))
    );
  }

  @ViewChild('logInLogOut', { static: false }) logInLogOut: ElementRef;
  getLoginLogoutText() {
    this.loginAuthService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.logInLogOut.nativeElement.innerHTML 
          = isLoggedIn ? 'Log Out' : 'Log In';
    })
  }

  // TODO: Configure log in status to work independently with each user account
  handleLoginLogout(): void {
    this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.showModal();
        this.loginAuthService.setIsLoggedIn(false);

        const currentRoute = this.router.url;
        if (currentRoute.includes('/profile')) {
          this.router.navigate(['/home']);
        }
      } 
      else {
        this.router.navigate(['/login']);
      }
    });
  }  

  showModal() {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.isShown = true;
        timer(1000).subscribe(() => {
          this.isShown = false;
        });
      }
    });
  }

}