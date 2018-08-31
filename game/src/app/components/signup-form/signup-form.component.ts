import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  email; password; displayName; errorMessage;
  constructor(private AuthService: AuthService, public dialogRef: MatDialogRef<SignupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() { }
  signUp() {
    this.AuthService.signUp(this.email, this.password, this.displayName)
      .then(res => this.dialogRef.close())
      .catch((err) => {
        this.errorMessage = err.message.slice();
      })
  }
}
