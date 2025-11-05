import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { HealthResponse } from '../../interfaces/health-response';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-check.html',
  styleUrl: './health-check.css'
})
export class HealthCheckComponent {

  private apiService = inject(ApiService);

  public healthStatus$: Observable<HealthResponse | { error: string }>;

  constructor() {
    this.healthStatus$ = this.apiService.getHealth().pipe(
      catchError((err) => {
        console.error("Error al contactar el backend:", err);
        const errorMsg = "No se pudo conectar al backend. ¿Está 'python manage.py runserver' activo?";
        return of({ error: errorMsg });
      })
    );
  }

  // Type guard para verificar si es un error
  isError(status: HealthResponse | { error: string }): status is { error: string } {
    return 'error' in status;
  }

  // Type guard para verificar si es HealthResponse
  isHealthResponse(status: HealthResponse | { error: string }): status is HealthResponse {
    return 'status' in status && 'message' in status;
  }
}