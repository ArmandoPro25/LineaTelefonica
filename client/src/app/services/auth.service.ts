import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  ClaveUsuario: string;
  NombreUsuario: string;
  FechaRegistro: Date;
  FechaNacimiento: Date;
  Telefono: number[];
}

export interface TipoLlamada {
  _id: string;
  nombre: string;
  costoPorMinuto: number;
}

export interface LlamadaRegistro {
  _id: string;
  usuario: {
    ClaveUsuario: string;
    NombreUsuario: string;
  };
  numeroTelefono: string;
  tipoLlamada: {
    nombre: string;
    costoPorMinuto: number;
  };
  minutosUtilizados: number;
  total: number;
  fechaLlamada: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(claveUsuario: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${claveUsuario}`).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error de autenticación:', error);
        alert('Clave de usuario incorrecta');
      }
    });
  }

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  buscarUsuarios(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/search/${query}`);
  }

  getTiposLlamada(): Observable<TipoLlamada[]> {
    return this.http.get<TipoLlamada[]>(`${this.apiUrl}/tipollamada`);
  }

  registrarLlamada(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrollamada`, datos);
  }

  getTodasLlamadas(): Observable<LlamadaRegistro[]> {
    return this.http.get<LlamadaRegistro[]>(`${this.apiUrl}/registrollamada`);
  }

  filtrarLlamadas(filtros: any): Observable<LlamadaRegistro[]> {
    let params = new HttpParams();
    
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) params = params.append(key, filtros[key]);
    });

    return this.http.get<LlamadaRegistro[]>(`${this.apiUrl}/registrollamada`, { params });
  }

  agregarTelefono(idUsuario: string, telefono: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${idUsuario}/telefonos`, { telefono });
  }

}