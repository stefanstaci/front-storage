import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, delay, Observable, pipe, throwError} from "rxjs";
import {IStorageFiles} from "../components/models/IStorageFile";
import {ErrorService} from "./error.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient,
              private errorService: ErrorService,
              private authService: AuthService) { }

  getAllFiles(): Observable<IStorageFiles[]> {
    return this.http.get<IStorageFiles[]>('http://localhost:7080/api/file', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
      .pipe(
        delay(500),
        catchError(this.errorHandler.bind(this))
      )
  }
  getFileContentByName(filename: string): Observable<Blob> {
    return this.http.get(`http://localhost:7080/api/file/${filename}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      responseType: 'blob' // specificăm tipul de răspuns ca fiind un obiect Blob
    });
  }

  addFile(file: FormData): Observable<IStorageFiles> {
    return this.http.post<IStorageFiles>(`http://localhost:7080/api/file/upload`, file, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  deleteFile(filename: string): Observable<string> {
    return this.http.delete<string>(`http://localhost:7080/api/file/${filename}`,{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError( () => error.message)
  }
}
