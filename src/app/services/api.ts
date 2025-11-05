// Este es un archivo NUEVO (modificado)

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HealthResponse } from '../interfaces/health-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  private apiUrl = '/api/tickets';

  constructor() { }

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health/`);
  }
}
