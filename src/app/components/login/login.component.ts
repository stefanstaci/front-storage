import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";
import { NgIf } from "@angular/common";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OtpDialogComponent } from '../shared/otp-dialog/otp-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  aSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

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

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginForm.disable();

    this.aSub = this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        () => {
          console.log("Login credentials accepted. Waiting for OTP.");

          const dialogRef = this.dialog.open(OtpDialogComponent);

          dialogRef.afterClosed().subscribe((otpCode: string | null) => {
            if (!otpCode) {
              console.log('OTP cancelled');
              this.loginForm.enable();
              return;
            }

            this.authService.verifyOtp(this.loginForm.value.email, otpCode)
              .subscribe(
                () => {
                  console.log("OTP verified. Logging in user.");
                  this.router.navigate(['/file']); // navigăm după OTP valid
                },
                (error) => {
                  console.warn("Invalid OTP", error);
                  this.loginForm.enable();
                  alert('Codul OTP este invalid. Încearcă din nou.');
                }
              );
          });

        },
        (error) => {
          console.warn("Login failed", error);
          this.loginForm.enable();
          alert('Username sau parola incorectă');
        }
      );
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registred']) {
        console.log('User registered successfully. Please log in.');
      } else if (params['accessDenied']) {
        console.log('Access denied. Please log in.');
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
