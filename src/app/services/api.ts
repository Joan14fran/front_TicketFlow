// src/app/services/api.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HealthResponse } from '../interfaces/health-response';
import { Category } from '../interfaces/category';
import { Ticket, TicketList } from '../interfaces/ticket';
import { Comment } from '../interfaces/ticket';

export interface TicketCreate {
  title: string;
  description: string;
  category: number;
  priority: 'low' | 'medium' | 'high';
}

export interface TicketUpdate {
  status?: 'open' | 'in_progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: number;
  comment?: string; 
}


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

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  getTickets(): Observable<TicketList[]> {
    return this.http.get<TicketList[]>(`${this.apiUrl}/tickets/`);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}/`);
  }

  createTicket(data: TicketCreate): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets/`, data);
  }

  updateTicket(id: number, data: TicketUpdate): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/`, data);
  }

  addComment(ticketId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/tickets/${ticketId}/add-comment/`, { content });
  }
}