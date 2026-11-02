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
      responseType: 'blob'
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

  encryptFile(filename: string): Observable<string> {
    return this.http.post<string>(`http://localhost:7080/api/file/encrypt/${filename}`, null,{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  decryptFile(filename: string): Observable<string> {
    return this.http.post<string>(`http://localhost:7080/api/file/decrypt/${filename}`, null,{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    })
  }

  getFileForEdit(filename: string): Observable<string> {
    return this.http.get(
      `http://localhost:7080/api/file/${filename}/edit`,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authService.getToken()}`
        }),
        responseType: 'text'
      }
    );
  }

  saveEditedFile(filename: string, content: string): Observable<void> {
    return this.http.put<void>(
      `http://localhost:7080/api/file/${filename}/edit`,
      content,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/octet-stream'
        })
      }
    );
  }

  shareFile(filename: string): Observable<string> {
    return this.http.post(
      `http://localhost:7080/api/share/${filename}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        },
        responseType: 'text'
      }
    );
  }

  sendShareLink(data: { filename: string; email: string }): Observable<String> {
    return this.http.post(
      `http://localhost:7080/api/share/send-link`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        },
      responseType: 'text'
      }
    );
  }

  grantUserAccess(data: {
    filename: string;
    email: string;
    permission: 'READ' | 'EDIT';
  }): Observable<void> {
    return this.http.post<void>(`http://localhost:7080/api/share/grant-access`, data,
    {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }});
  }


}
