import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { NavbarComponent } from '../navbar/navbar';

import { ApiService, TicketUpdate } from '../../services/api'; 
import { AuthService } from '../../services/auth.service';
import { TicketList, Ticket } from '../../interfaces/ticket';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NavbarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css',
})
export class AgentDashboard implements OnInit {

  private apiService = inject(ApiService);
  private authService = inject(AuthService); 
  private fb = inject(FormBuilder); 

  allTickets: TicketList[] = [];
  ticketsLoading = false;
  ticketsError = '';

  isModalVisible = false;
  selectedTicket: Ticket | null = null;
  modalLoading = false;
  modalError = '';

  updateForm: FormGroup;
  currentAgentId: number | null = null;
  updateLoading = false;
  updateError = '';
  updateSuccess = '';

  constructor() {
    const agentId = this.authService.getUserId();
    this.currentAgentId = agentId ? +agentId : null;

    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      priority: ['', Validators.required],
      comment: [''] 
    });
  }

  ngOnInit(): void {
    this.loadAllTickets();
  }

  loadAllTickets(closeModal: boolean = false): void {
    this.ticketsLoading = true;
    this.ticketsError = '';

    this.apiService.getTickets().subscribe({
      next: (data) => {
        this.allTickets = data;
        this.ticketsLoading = false;

        if (closeModal) {
          this.closeModal();
        }
      },
      error: (err) => {
        this.ticketsError = 'No se pudieron cargar los tickets.';
        this.ticketsLoading = false;
      }
    });
  }

  openTicketModal(id: number): void {
    this.isModalVisible = true;
    this.modalLoading = true;
    this.modalError = '';
    this.updateError = '';
    this.updateSuccess = '';
    this.selectedTicket = null;

    this.apiService.getTicketById(id).subscribe({
      next: (data) => {
        this.selectedTicket = data;
        this.updateForm.patchValue({
          status: data.status,
          priority: data.priority,
          comment: ''
        });
        this.modalLoading = false;
      },
      error: (err) => {
        this.modalError = 'No se pudo cargar el detalle del ticket.';
        this.modalLoading = false;
      }
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedTicket = null;
  }


  assignToMe(): void {
    if (!this.selectedTicket || !this.currentAgentId || this.updateLoading) return;

    if (this.selectedTicket.assigned_to === this.currentAgentId) {
      this.updateSuccess = 'Ya estás asignado a este ticket.';
      return;
    }

    const payload: TicketUpdate = {
      assigned_to: this.currentAgentId,
      comment: 'Asignándome este ticket para revisión.'
    };

    this.handleUpdate(this.selectedTicket.id, payload);
  }

  onUpdateTicket(): void {
    if (!this.selectedTicket || this.updateForm.invalid || this.updateLoading) return;

    const formValues = this.updateForm.value;
    const payload: TicketUpdate = {
      status: formValues.status,
      priority: formValues.priority,
    };

    if (formValues.comment && formValues.comment.trim() !== '') {
      payload.comment = formValues.comment.trim();
    }

    this.handleUpdate(this.selectedTicket.id, payload);
  }

  private handleUpdate(id: number, payload: TicketUpdate): void {
    this.updateLoading = true;
    this.updateError = '';
    this.updateSuccess = '';

    this.apiService.updateTicket(id, payload).subscribe({
      next: (updatedTicket) => {
        this.updateLoading = false;
        this.updateSuccess = '¡Ticket actualizado con éxito!';

        this.selectedTicket = updatedTicket;

        this.updateForm.patchValue({ comment: '' });

        this.loadAllTickets(true); 
      },
      error: (err) => {
        this.updateLoading = false;
        this.updateError = 'Error al actualizar el ticket.';
        console.error('Error en handleUpdate', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}