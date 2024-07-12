import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CommunityComponent } from './community/community.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CarouselComponent } from './carousel/carousel.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { SearchRecipeComponent } from './search-recipe/search-recipe.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';

import { HomeService } from '../services/home.service';
import { LoginAuthentication } from '../services/login-authentication.service';
import { SignupService } from '../services/signup.service';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { UserService } from '../services/user-service.service';
import { CommunityService } from '../services/community-service.service';
import { ShareCommunityService } from '../services/share-community.service';
import { SearchService } from '../services/search.service';
import { SavedRecipesService } from '../services/saved-recipes.service';
import { RecipeService } from '../services/recipe-service.service';
import { RecipeResultService } from '../services/recipe-result.service';
import { RecipeRatingService } from '../services/recipe-rating.service';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CommunityComponent,
    SearchComponent,
    ProfileComponent,
    CarouselComponent,
    SearchRecipeComponent,
    RecipeDetailsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserVerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ScrollingModule,

  ],
  providers: [
    provideAnimationsAsync(),
    
    LoginAuthentication,
    SignupService,
    LoginAuthentication,
    SignupService,
    ForgotPasswordService,
    UserService,
    CommunityService,
    ShareCommunityService,
    SearchService,
    SavedRecipesService,
    RecipeService,
    RecipeResultService,
    RecipeRatingService,
    HomeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
