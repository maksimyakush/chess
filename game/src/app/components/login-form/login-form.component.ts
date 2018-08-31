import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  email; password; userId; errorMessage;
  constructor(private AuthService: AuthService, private router: Router, public dialogRef: MatDialogRef<LoginFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  login() {
    this.AuthService.login(this.email, this.password)
      .then(res => this.dialogRef.close())
      .catch((err) => {
        this.errorMessage = err.message.slice();
      })
  }

  ngOnInit() {
  }
}
