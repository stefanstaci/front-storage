import { Injectable } from '@angular/core';
import {catchError, delay, Observable} from "rxjs";
import {IStorageFiles} from "../components/models/IStorageFile";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IReservation} from "../components/models/IReservation";
import {ErrorService} from "./error.service";
import {AuthService} from "./auth.service";
import {IUser} from "../components/models/IUser";
import {IDashboardInfo} from "../components/models/IDashboardInfo";

@Injectable({
  providedIn: 'root'
})
export class UserReservationService {

  constructor(private http: HttpClient,
              private errorService: ErrorService,
              private authService: AuthService) { }

  getReservation() : Observable<IReservation[]> {
    return this.http.get<IReservation[]>(`http://localhost:7080/api/size`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  getDashboardInfo() : Observable<IDashboardInfo> {
    return this.http.get<IDashboardInfo>(`http://localhost:7080/api/file/info-dashboard`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }
  getReservationAll() : Observable<IReservation[]> {
    return this.http.get<IReservation[]>(`http://localhost:7080/api/size/all`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  getUser() : Observable<IUser> {
    return this.http.get<IUser>(`http://localhost:7080/api/user`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  getAllUsers() : Observable<IUser[]> {
    return this.http.get<IUser[]>(`http://localhost:7080/api/user/all`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  deleteUsers(id: number) : Observable<any> {
    return this.http.delete<any>(`http://localhost:7080/api/user/delete/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  activateSize(id: number) : Observable<any> {
    return this.http.put<any>(`http://localhost:7080/api/size/admin/activate/${id}`, {},{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  demandSize(totalSize: number) : Observable<IReservation> {
    console.log(totalSize)
    return this.http.post<IReservation>(`http://localhost:7080/api/size/demand`, {totalSize},{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

}
