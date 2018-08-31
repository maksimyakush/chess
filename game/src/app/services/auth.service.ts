import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


@Injectable()
export class AuthService {
  currentUser;
  userId: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.currentUser = this.afAuth.authState;
    this.afAuth.authState.subscribe(res => {
      if (res) {
        this.userId = res.uid;
      }
    });
  }

  get currentId() {
    return this.userId;
  }

  signUp(email, password, displayName) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(data => {
        data.updateProfile({ displayName });
        return data;
      })
      .then(data => {
        this.db.doc(`users/${data.uid}`).set({
          email,
          password,
          displayName,
          key: data.uid,
          isOnline: true,
          rating: 1500,
          timeControl: 300,
          status: ""
        });
      });

  }

  get currentUserId(): string {
    this.currentUser.subscribe(res => {
      this.userId = res.uid;
    });
    return this.userId || '';
  }

  getAuthUser() {
    return this.currentUser;
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        res.updateProfile({ displayName: res.displayName });
        this.db.doc(`users/${res.uid}`).update({ isOnline: true });
      });
  }

  setStatus(status: boolean) {
    return this.db.doc(`users/${this.userId}`).update({ isOnline: false });
  }

  logout() {
    this.db.doc(`users/${this.userId}`).update({ isOnline: false })
      .then(res => this.afAuth.auth.signOut());
  }
}
