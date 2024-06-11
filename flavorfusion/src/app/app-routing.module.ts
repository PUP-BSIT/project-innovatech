import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginAuthentication } from '../services/login-authentication.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'sign-up', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private loginAuthService: 
    LoginAuthentication, private router: Router) {
    
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    this.loginAuthService.checkAuthentication();

    this.loginAuthService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
    
        this.router.navigateByUrl('/login');
      }
      else {
        this.router.navigateByUrl('/home');
      }
    });
  }
}