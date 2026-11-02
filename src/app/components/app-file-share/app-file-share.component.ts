import {Component, ElementRef, HostListener, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service';
import { debounceTime, distinctUntilChanged, filter, Observable, switchMap, tap } from 'rxjs';
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-file-share',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './app-file-share.component.html',
  styleUrls: ['./app-file-share.component.css']
})
export class AppFileShareComponent {

  @Input() filename!: string;

  // Formul pentru input email + permission
  shareForm: FormGroup;

  // Stream pentru autocomplete
  emails$!: Observable<string[]>;
  showDropdown = false;

  loading = false;
  successMessage?: string;
  errorMessage?: string;

  permissions = ['READ', 'WRITE']; // pentru select

  constructor(
    private fb: FormBuilder,
    private shareService: FileService,
    private modalService: ModalService,
    private userService: UserService,
    private elRef: ElementRef
  ) {
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      permission: ['READ', Validators.required]
    });
    this.emails$ = this.shareForm.controls['email'].valueChanges.pipe(
      debounceTime(300),
      filter((v): v is string => typeof v === 'string' && v.length >= 2),
      distinctUntilChanged(),
      tap(value => {
        console.log('Input email:', value);
        this.showDropdown = true;
      }),
      switchMap(value => this.userService.searchEmails(value))
    );

  }


  selectEmail(email: string) {
    this.shareForm.controls['email'].setValue(email);
    this.showDropdown = false;
  }

  // Trimite link de partajare pe email
  sendLink() {
    if (this.shareForm.invalid) return;

    this.loading = true;
    this.errorMessage = undefined;
    this.successMessage = undefined;

    this.shareService.sendShareLink({
      filename: this.filename,
      email: this.shareForm.value.email
    }).subscribe({
      next: () => {
        this.successMessage = 'Link trimis cu succes!';
        this.loading = false;
      },
      error: err => {
        console.log('STATUS:', err.status);
        console.log('ERROR BODY:', err.error);
        this.errorMessage = err.error?.message || 'Eroare la trimiterea linkului';
        this.loading = false;
      }
    });
  }

  // Acordă acces direct utilizatorului
  grantAccess() {
    if (this.shareForm.invalid) return;

    this.loading = true;
    this.errorMessage = undefined;
    this.successMessage = undefined;

    this.shareService.grantUserAccess({
      filename: this.filename,
      email: this.shareForm.value.email,
      permission: this.shareForm.value.permission
    }).subscribe({
      next: () => {
        this.successMessage = 'Acces acordat cu succes!';
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Eroare la acordarea accesului';
        this.loading = false;
      }
    });
  }

  // Închide popup-ul
  close() {
    this.modalService.close();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
