import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from "../../services/auth.service";
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  @Input() user: User;
  currentUser;
  currentUserKey;
  userName;
  userRating;
  userPath;
  userKey;
  awaitingForPlay: boolean = false;
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  pairsToPlayCollection;
  pairsToPlay;
  usersCollection1: AngularFirestoreCollection<User>;
  users1: Observable<User[]>;
  currentUserObj;
  userDocument;
  userGamesHistoryDocument;
  userGamesHistory;
  constructor(private db: AngularFirestore, public AuthService: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.usersCollection = this.db.collection("users");
    this.userDocument = this.db.doc(`users/${this.user.key}`);
    this.userGamesHistoryDocument = this.db.collection(`users/${this.user.key}/gamesHistory`);
    this.userGamesHistory = this.userGamesHistoryDocument.valueChanges();
    this.userGamesHistory.subscribe(userGameHistory => {
      let sum = 0;
      userGameHistory.map((a, b) => {
        sum += a.changeRating;
      });
      this.userDocument.update({ rating: 1500 + sum });
    });
    this.users = this.usersCollection.valueChanges();
    this.users.subscribe(user => {
      user.map(data => {
        if (data.key === this.AuthService.currentId) {
          this.currentUserObj = data;
        }
      });
    });
  }

  invite() {
    this.db.doc(`users/${this.user.key}/opponents/${this.AuthService.currentId}`).set({
      ...this.currentUserObj,
      awaitingForPlay: this.AuthService.currentId
    });
    this.db.doc(`users/${this.AuthService.currentId}`).update({ status: "searching" });
    this.db.doc(`game/${this.user.key + this.AuthService.currentId}`).set({
      firstPlayerKey: this.AuthService.currentId,
      isFirstPlayerReady: true,
    });
  }
}





