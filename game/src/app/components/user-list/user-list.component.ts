import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models/user.model';
import { Game } from '../../models/game.model';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  userOpponentsCollection: AngularFirestoreCollection<User>;
  userOpponents: Observable<User[]>;
  gameCollection: AngularFirestoreCollection<Game>;
  game: Observable<Game[]>;
  currentUser;
  currentId;
  isUserRegistered: boolean;
  randomize: number = Math.floor(Math.random() * 2);
  mode = new FormControl('over');
  constructor(private db: AngularFirestore, public snackBar: MatSnackBar, private AuthService: AuthService, private router: Router) { }

  openSnackBar(message: string, action: string) {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  ngOnInit() {
    this.usersCollection = this.db.collection("users", ref => ref.where('isOnline', '==', true));
    this.users = this.usersCollection.valueChanges();
    this.gameCollection = this.db.collection("game");
    this.game = this.gameCollection.valueChanges();
    this.users.subscribe(res => {
      this.userOpponentsCollection = this.db.collection(`users/${this.AuthService.currentId}/opponents`);
      this.userOpponents = this.userOpponentsCollection.valueChanges();
      this.userOpponents.subscribe(res => {
        res.map(opponentData => {
          if (opponentData.awaitingForPlay) {
            let snackBarRef = this.snackBar.open(`${opponentData.displayName}  ${opponentData.rating}`, "Play", { duration: 10000 })
            snackBarRef.onAction()
              .subscribe(() => {
                this.db.doc(`game/${this.AuthService.currentId + opponentData.awaitingForPlay}`).update({
                  FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                  isSecondPlayerReady: true,
                  secondPlayerKey: this.AuthService.currentId,
                  turn: "w",
                  firstPlayerTime: opponentData.timeControl,
                  secondPlayerTime: opponentData.timeControl,
                  timeControl: opponentData.timeControl,
                  gameKey: this.AuthService.currentId + opponentData.awaitingForPlay,
                  gameOver: false,
                  rematchDisabled: true,
                  resignDisabled: true,
                  checked: false
                });

                if (this.randomize === 1) {
                  this.db.doc(`game/${this.AuthService.currentId + opponentData.awaitingForPlay}`).update({
                    firstPlayerKey: this.AuthService.currentId,
                    secondPlayerKey: opponentData.awaitingForPlay
                  });
                }
              });
            snackBarRef.afterDismissed()
              .subscribe(() => {
                this.db.doc(`users/${this.AuthService.currentId}/opponents/${opponentData.awaitingForPlay}`).delete();
                setTimeout(() => this.db.doc(`users/${opponentData.awaitingForPlay}`).update({ status: "" }), 9000);
              });
          }
        });
      });
      this.game.subscribe(res => {
        res.map(gameData => {
          if (gameData.isFirstPlayerReady && gameData.isSecondPlayerReady) {
            this.userOpponentsCollection = this.db.collection(`users/${this.AuthService.currentId}/opponents`);
            this.userOpponents = this.userOpponentsCollection.valueChanges();
            this.db.doc(`users/${gameData.firstPlayerKey}`).update({ status: "playing" });
            this.db.doc(`users/${gameData.secondPlayerKey}`).update({ status: "playing" });
            if (this.AuthService.currentId === gameData.firstPlayerKey || this.AuthService.currentId === gameData.secondPlayerKey) {
              this.router.navigate([`chessfield/${gameData.gameKey}`]);
            }
          }
        });
      });
    });
  }
}