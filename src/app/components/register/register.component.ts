import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  
  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['client', [Validators.required]] 
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.errors) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = false;
    
    const { username, email, password, role } = this.registerForm.value;
    const registerData = { username, email, password, role };
    
    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.loading = false;
        this.success = true;
        this.registerForm.reset();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.loading = false;
        
        if (err.error) {
          if (err.error.username) {
            this.error = `Usuario: ${err.error.username[0]}`;
          } else if (err.error.email) {
            this.error = `Email: ${err.error.email[0]}`;
          } else if (err.error.password) {
            this.error = `Contraseña: ${err.error.password[0]}`;
          } else {
            this.error = 'Error al registrar usuario. Por favor intenta de nuevo.';
          }
        } else {
          this.error = 'Error de conexión. Por favor verifica tu conexión.';
        }
      }
    });
  }
  
  get username() {
    return this.registerForm.get('username');
  }
  
  get email() {
    return this.registerForm.get('email');
  }
  
  get password() {
    return this.registerForm.get('password');
  }
  
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  
  get role() {
    return this.registerForm.get('role');
  }
}