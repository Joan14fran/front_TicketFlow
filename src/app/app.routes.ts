import { Routes } from '@angular/router';

// Componentes de autenticación
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
// Dashboards por rol
import { ClientDashboard } from './components/client-dashboard/client-dashboard';
import { AgentDashboard } from './components/agent-dashboard/agent-dashboard';
// Guardianes
import { roleGuard } from './guards/role-guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { 
    path: 'dashboard-client', 
    component: ClientDashboard,
    canActivate: [authGuard, roleGuard], 
    data: { expectedRole: 'client' } 
  },
  { 
    path: 'dashboard-agent', 
    component: AgentDashboard,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'agent' }
  },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];