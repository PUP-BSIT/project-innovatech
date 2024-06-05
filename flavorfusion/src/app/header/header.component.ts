import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showSearchComponent: boolean = false;
  searchText: string = '';

  constructor(private router: Router) {}

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
}