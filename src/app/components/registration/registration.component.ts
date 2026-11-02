import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-registration',
  standalone: true,
    imports: [
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit, OnDestroy{

  registrationForm!: FormGroup
  aSub!: Subscription

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  submitRegistration() {
    this.registrationForm.disable()
    this.aSub = this.authService.registration(this.registrationForm.value.email, this.registrationForm.value.username, this.registrationForm.value.password, this.registrationForm.value.firstName, this.registrationForm.value.lastName).subscribe(
      () => {
        this.router.navigate(['/login']);
        console.log("registration success")
      },
      (error) => {
        console.warn(error)
        this.registrationForm.enable()
      }
    );
  }
  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          this.passwordValidator
        ]),
        checkPassword: new FormControl('', [Validators.required])
      },
      { validators: this.passwordMatchValidator }
    );


    this.route.queryParams.subscribe( (params: Params) => {
      if (params['registred']) {

      }else if (params['accessDenied']){

      }
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 12;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid =
      hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;

    return passwordValid ? null : { strongPassword: true };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('checkPassword')?.value;

    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

}

