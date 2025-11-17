import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';

import { ApiService, TicketCreate } from '../../services/api';
import { Category } from '../../interfaces/category';
import { TicketList, Ticket } from '../../interfaces/ticket';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    DatePipe
  ],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard implements OnInit {

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  ticketForm: FormGroup;
  categories: Category[] = [];
  formLoading = false; 
  formError = '';   
  formSuccess = '';  

  myTickets: TicketList[] = [];
  ticketsLoading = false;
  ticketsError = '';

  isModalVisible = false;
  selectedTicket: Ticket | null = null;
  modalLoading = false;
  modalError = '';

  constructor() {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      priority: ['low', Validators.required],
      category: [null, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadMyTickets();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => { this.categories = data; },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.formError = 'No se pudieron cargar las categorías.';
      }
    });
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    this.formLoading = true;
    this.formError = '';
    this.formSuccess = '';
    const formData: TicketCreate = { ...this.ticketForm.value, category: +this.ticketForm.value.category };

    this.apiService.createTicket(formData).subscribe({
      next: (response) => {
        this.formLoading = false;
        this.formSuccess = `¡Ticket #${response.id} creado exitosamente!`;
        this.ticketForm.reset({ priority: 'low', category: null });
        this.loadMyTickets(); 
      },
      error: (err) => {
        this.formLoading = false;
        this.formError = 'Error al crear el ticket. Revisa los campos.';
      }
    });
  }

  loadMyTickets(): void {
    this.ticketsLoading = true;
    this.ticketsError = '';
    this.apiService.getTickets().subscribe({
      next: (data) => {
        this.myTickets = data;
        this.ticketsLoading = false;
      },
      error: (err) => {
        this.ticketsError = 'No se pudieron cargar tus tickets.';
        this.ticketsLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  openTicketModal(id: number): void {
    this.isModalVisible = true;
    this.modalLoading = true;
    this.modalError = '';
    this.selectedTicket = null;

    this.apiService.getTicketById(id).subscribe({
      next: (data) => {
        this.selectedTicket = data;
        this.modalLoading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle del ticket', err);
        this.modalError = 'No se pudo cargar el detalle del ticket.';
        this.modalLoading = false;
      }
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedTicket = null;
  }
}