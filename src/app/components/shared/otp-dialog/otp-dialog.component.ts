import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // pentru [(ngModel)]
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    NgIf
  ]
})
export class OtpDialogComponent {

  otp = '';
  errorMessage: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<OtpDialogComponent>
  ) {}

  onConfirm(): void {
    if (this.otp.length !== 6) {
      this.errorMessage = 'Cod OTP invalid';
      return;
    }

    this.dialogRef.close(this.otp);
  }

  // submitLogin() {
  //   this.loginForm.disable()
  //   this.aSub = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
  //     () => {
  //       this.router.navigate(['/file']);
  //       console.log("login success")
  //     },
  //     (error) => {
  //       console.warn(error)
  //       this.loginForm.enable()
  //     }
  //   );
  // }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
