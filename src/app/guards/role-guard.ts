import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // 

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  const currentUserRole = authService.getUserRole(); 

  if (!currentUserRole || currentUserRole !== expectedRole) {
    console.error(`Acceso denegado. Se esperaba ${expectedRole} pero se obtuvo ${currentUserRole}`);
    router.navigate(['/login']); // 
    return false;
  }

  return true;
};