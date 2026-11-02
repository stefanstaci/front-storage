import {Component, OnInit} from '@angular/core';
import {UserReservationService} from "../../services/user-reservation.service";
import {async, filter, Observable} from "rxjs";
import {IReservation} from "../models/IReservation";
import {IUser} from "../models/IUser";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    NavbarComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  constructor(private reservationService: UserReservationService) {
  }

  reservations$!: Observable<IReservation[]>;
  users$!: Observable<IUser[]>
  totalUsedSpace: number = 0;
  totalAllocatedSpace: number = 0;

  ngOnInit(): void {
    this.reservations$ = this.reservationService.getReservationAll()
    this.users$ = this.reservationService.getAllUsers()

    this.reservations$.subscribe(res => {
      if (res) {
        this.totalUsedSpace = res.reduce((acc, r) => acc + r.usedSize, 0);
        this.totalAllocatedSpace = res.reduce((acc, r) => acc + r.totalSize, 0);
      }
    });
  }

  deleteUser(id: number) {
    this.reservationService.deleteUsers(id).subscribe()
  }

  activateSize(id: number) {
    console.log(id)
    this.reservationService.activateSize(id).subscribe()
  }
}
