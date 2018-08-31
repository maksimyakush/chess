import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { LoginFormComponent } from '../login-form/login-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';

import { AuthService } from "../../services/auth.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser;
  userName;
  isLogged = true;
  usersCollection;
  users;
  constructor(private AuthService: AuthService, private db: AngularFirestore, private router: Router, public dialog: MatDialog) { }
  ngOnInit() {
    this.usersCollection = this.db.collection("users");
    this.users = this.usersCollection.valueChanges();
    this.currentUser = this.AuthService.currentUser;
    this.users
      .subscribe(res => {
        res.map(data => {
          if (this.AuthService.currentId === data.key) {
            this.userName = data.displayName;
          }
        })
      })
  }

  openDialogLogin() {
    const dialogRef = this.dialog.open(LoginFormComponent);
  }

  openDialogSignUp() {
    const dialogRef = this.dialog.open(SignupFormComponent);
  }

  logout() {
    this.AuthService.logout();
  }
}
