import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{

  loginForm!: FormGroup
  aSub!: Subscription

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  submitLogin() {
    this.loginForm.disable()
    this.aSub = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      () => {
        this.router.navigate(['/file']);
        console.log("login success")
      },
      (error) => {
        console.warn(error)
        this.loginForm.enable()
      }
    );
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup( {
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    })

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

}
