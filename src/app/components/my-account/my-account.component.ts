import {Component, OnInit} from '@angular/core';
import {UserReservationService} from "../../services/user-reservation.service";
import {IReservation} from "../models/IReservation";
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {async, Observable, Subscription} from "rxjs";
import {IUser} from "../models/IUser";
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from "../navbar/navbar.component";
import {GlobalErrorComponent} from "../global-error/global-error.component";
import {IDashboardInfo} from "../models/IDashboardInfo";
import {DeviceService} from "../../services/device.service";

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    KeyValuePipe,
    FormsModule,
    NavbarComponent,
    GlobalErrorComponent
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit{

  constructor(private reservationService: UserReservationService, private deviceService: DeviceService) {
  }

  reservations$!: Observable<IReservation[]>;
  user$!: Observable<IUser>
  selectedSize!: number;
  aSub!: Subscription
  dashboardInfo$!: Observable<IDashboardInfo>

  ngOnInit(): void {
    this.reservations$ = this.reservationService.getReservation()
    this.user$ = this.reservationService.getUser()
    this.dashboardInfo$ = this.reservationService.getDashboardInfo()
  }

  protected readonly async = async;

  demandSize() {
    this.aSub = this.reservationService.demandSize(this.selectedSize).subscribe(
      () => {
        console.log(this.selectedSize)
      }
    )
  }

  showAddDevice = false;
  pairingCode = '';

  toggleAddDevice() {
    this.showAddDevice = !this.showAddDevice;
  }

  submitPairingCode() {
    if (!this.pairingCode) return;
    // apelează serviciul backend pentru validare cod
    this.deviceService.pairDevice(this.pairingCode).subscribe({
      next: (res) => {
        console.log('Dispozitiv asociat cu succes', res);
        this.showAddDevice = false;
        this.pairingCode = '';
      },
      error: (err) => {
        console.error('Eroare la asociere dispozitiv', err);
      }
    });
  }

  cancelAddDevice() {
    this.showAddDevice = false;
    this.pairingCode = '';
  }

}
