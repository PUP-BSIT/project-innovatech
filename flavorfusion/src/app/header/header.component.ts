import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { LoginAuthentication } from '../../services/login-authentication.service';
import { UserService } from '../../services/user-service.service';

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
  userAvatar: string = 'assets/images/profile.png';

  constructor(
    private router: Router, 
    private loginAuthService: LoginAuthentication,
    private userService: UserService
  ) {
    this.isLoggedIn$ = this.loginAuthService.isLoggedIn$;
  }

  ngOnInit() {
    // Subscribe to router events to reset search
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.router.url.includes('/search')) {
        this.resetSearch();
      }
      this.getLoginLogoutText();
    });

    // Fetch user profile if already logged in
    this.loginAuthService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.fetchUserProfile();
      }
    });

    // Update user avatar based on login status
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.fetchUserProfile();
      } else {
        this.userAvatar = 'assets/images/profile.png'; // Reset to default if logged out
      }
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
      map((isLoggedIn: boolean) => (isLoggedIn ? '/profile' : '/login'))
    );
  }

  @ViewChild('logInLogOut', { static: false }) logInLogOut: ElementRef;
  getLoginLogoutText() {
    this.loginAuthService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.logInLogOut.nativeElement.innerHTML = isLoggedIn ? 'Log Out' : 'Log In';
    });
  }

  handleLoginLogout(): void {
    this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.showModal();
        this.loginAuthService.logout();
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  showModal() {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.isShown = true;
      }
    });
  }

  closeModal(): void {
    this.isShown = false;
  }

  fetchUserProfile() {
    this.userService.getUserProfile().subscribe(profile => {
      this.userAvatar = profile?.profile_picture || 'assets/images/profile.png';
    });
  }
}
