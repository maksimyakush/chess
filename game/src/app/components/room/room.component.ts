import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  particlesStyle: object = {};
  particlesParams: object = {};
  width = 100;
  height = 100;
  constructor(public AuthService:AuthService) { }

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
  }

}
