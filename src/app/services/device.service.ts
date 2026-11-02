import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modele pentru request/response
export interface PairingCodeRequest {
  code?: string; // cod introdus de utilizator
}

export interface PairingCodeResponse {
  pairingCode: string; // cod generat pentru dispozitiv principal
  expiresAt: string;   // data expirării codului
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private baseUrl = 'http://localhost:7080/api/devices'; // ruta backend

  constructor(private http: HttpClient) { }

  /**
   * Solicită generarea unui cod de pairing pentru dispozitivul principal
   */
  generatePairingCode(): Observable<PairingCodeResponse> {
    return this.http.post<PairingCodeResponse>(`${this.baseUrl}/generate-code`, {});
  }

  /**
   * Asociere dispozitiv cu contul utilizatorului folosind codul de pairing
   */
  pairDevice(code: string): Observable<any> {
    const request: PairingCodeRequest = { code };
    return this.http.post(`${this.baseUrl}/pair`, request);
  }

  /**
   * Opțional: obține lista dispozitivelor asociate
   */
  getDevices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
