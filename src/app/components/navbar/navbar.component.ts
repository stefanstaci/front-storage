import {Component, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {GlobalErrorComponent} from "../global-error/global-error.component";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FileComponent} from "../file/file.component";
import {FileUploadFormComponent} from "../file-upload-form/file-upload-form.component";
import {ModalComponent} from "../modal/modal.component";
import {Router, RouterLink} from "@angular/router";
import {UserReservationService} from "../../services/user-reservation.service";
import {IUser} from "../models/IUser";
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    GlobalErrorComponent,
    NgStyle,
    FormsModule,
    AsyncPipe,
    NgForOf,
    [UpperCasePipe],
    NgIf,
    FileComponent,
    FileUploadFormComponent,
    ModalComponent,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  title = 'DataStorage'
  loading = false

  constructor(
    private router: Router,
    private reservationService: UserReservationService
) {
  }
  dropdownOpen = false;

  user$!: Observable<IUser>

  ngOnInit(): void {
    this.loading = true
    this.user$ = this.reservationService.getUser()

  }

  isMyAccount() {
    return this.router.url.includes('my-account');
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


}
