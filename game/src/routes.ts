import { Router } from '@angular/router';
import { SignupFormComponent } from './app/components/signup-form/signup-form.component';
import { RoomComponent } from './app/components/room/room.component';
import { LoginFormComponent } from './app/components/login-form/login-form.component';
import { UserProfileComponent } from './app/components/user-profile/user-profile.component';
import { GamefieldComponent } from './app/components/gamefield/gamefield.component';
import { EngineGamefieldComponent } from './app/components/engine-gamefield/engine-gamefield.component';
import { AboutComponent } from './app/components/about/about.component';

export const appRoutes = [
    { path: 'profiles/:key/:username', component: UserProfileComponent },
    {path: 'chessfield/:key', component: GamefieldComponent},
    { path: 'engine-chessfield', component: EngineGamefieldComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'signup', component: SignupFormComponent },
    { path: '', component: RoomComponent },
];
