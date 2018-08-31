import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  user: User;
  constructor(private db: AngularFirestore, private route: ActivatedRoute) { }
  particlesStyle: object = {};
  particlesParams: object = {};
  width = 100;
  height = 100;
  ngOnInit() {
    this.particlesStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };
    this.particlesParams = {
      particles: {
        number: {
          value: 50,
        },
        color: {
          value: '#ff0000'
        },
        shape: {
          type: 'triangle',
        },
      }
    };
    this.usersCollection = this.db.collection("users");
    this.users = this.usersCollection.valueChanges();
    this.route.paramMap
      .subscribe(params => {
        let key = params.get("key");
        this.users.subscribe(res => {
          res.forEach(res => {
            if (res.key === key) {
              this.user = res;
            }
          })
        })
      })
  }

}


