import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
import { CarouselService } from '../services/carousel.service';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync(),
    CarouselService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
