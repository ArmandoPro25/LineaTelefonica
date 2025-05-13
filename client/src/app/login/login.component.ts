import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      claveUsuario: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const clave = this.loginForm.value.claveUsuario;
      if (clave) {
        this.authService.login(clave);
      }
    }
  }
}