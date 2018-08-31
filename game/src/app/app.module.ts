import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '../routes';

import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { RoomComponent } from './components/room/room.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AuthService } from './services/auth.service';
import { UserComponent } from './components/user/user.component';
import { GamefieldComponent } from './components/gamefield/gamefield.component';
import { GameSetterComponent } from './components/game-setter/game-setter.component';
import { EngineComponent } from './components/engine/engine.component';
import { ToMinutesPipe } from './pipes/to-minutes.pipe';
import { EngineGamefieldComponent } from './components/engine-gamefield/engine-gamefield.component';
import { ParticlesModule } from 'angular-particle';
import { AboutComponent } from './components/about/about.component';

const firebaseConfig = {
  apiKey: "AIzaSyAu1UlVOZn163FYPPopWK4GVb2RkFWZRFU",
  authDomain: "game-3427b.firebaseapp.com",
  databaseURL: "https://game-3427b.firebaseio.com",
  projectId: "game-3427b",
  storageBucket: "game-3427b.appspot.com",
  messagingSenderId: "39576067382"
};

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserProfileComponent,
    NavbarComponent,
    LoginFormComponent,
    SignupFormComponent,
    RoomComponent,
    UserComponent,
    GamefieldComponent,
    GameSetterComponent,
    EngineComponent,
    ToMinutesPipe,
    EngineGamefieldComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatListModule,
    MatDialogModule,
    MatToolbarModule,
    MatGridListModule,
    MatSidenavModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatStepperModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ParticlesModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
