import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mostrarRegistro = false;
  
  toggleRegistro() {
    this.mostrarRegistro = !this.mostrarRegistro;
  }
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.authService.logout();
    }
  }

  logout() {
    this.authService.logout();
  }
}