import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-game-setter',
  templateUrl: './game-setter.component.html',
  styleUrls: ['./game-setter.component.css']
})
export class GameSetterComponent implements OnInit {
  userDocument: AngularFirestoreDocument<User>;
  user: Observable<User>;
  userId;
  timeControl = new FormControl();
  constructor(private db: AngularFirestore, private AuthService: AuthService) {
  }

  ngOnInit() {
    this.timeControl.valueChanges.subscribe(res => {
      if (this.AuthService.currentUserId) {
        this.AuthService.currentUser.subscribe(currentUser => {
            this.userId = currentUser.uid;
            this.userDocument = this.db.doc(`users/${this.userId}`);
            this.user = this.userDocument.valueChanges();  
            this.userDocument.update({ timeControl: +res })
        })
      }
    })
  }
}
