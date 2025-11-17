// src/app/interfaces/ticket.ts
import { Category } from './category';

export interface Comment {
    id: number;
    user: string;
    user_role: 'client' | 'agent';
    content: string;
    created_at: string;
}

export interface TicketList {
    id: number;
    title: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    category_name: string;
    created_by: string;
    assigned_to_username: string | null;
    comments_count: number;
    created_at: string;
    updated_at: string;
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
    category: number; 
    category_name: string;
    created_by: string;
    assigned_to: number | null; 
    assigned_to_username: string | null;
    comments: Comment[];
}