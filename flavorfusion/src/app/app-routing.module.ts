import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SearchRecipeComponent } from './search-recipe/search-recipe.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'search-recipe', component: SearchRecipeComponent },
  { path: 'forgot_password', component: ForgotPasswordComponent },
  { path: 'reset_password', component: ResetPasswordComponent },
  { path: 'recipe-details/:id', component: RecipeDetailsComponent }, 
  { path: 'user_verification', component: UserVerificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
  }
}