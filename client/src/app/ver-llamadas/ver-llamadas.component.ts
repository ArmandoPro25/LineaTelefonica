import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ver-llamadas',
  standalone: false,
  templateUrl: './ver-llamadas.component.html',
  styleUrls: ['./ver-llamadas.component.css']
})
export class VerLlamadasComponent implements OnInit {
  llamadas: any[] = [];
  columnas: string[] = [
    'usuario', 
    'telefono', 
    'tipo', 
    'costoMinuto', 
    'minutos', 
    'total', 
    'fecha'
  ];
  filtroForm: FormGroup;
  tiposLlamada: any[] = [];
  cargando = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      search: [''],
      numeroTelefono: [''],
      tipoLlamada: [''],
      fecha: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTiposLlamada();
    this.configurarFiltros();
    this.cargarLlamadasIniciales();
  }

  cargarLlamadasIniciales() {
    this.cargando = true;
    this.authService.filtrarLlamadas({})
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (llamadas) => this.llamadas = llamadas,
        error: (error) => console.error('Error inicial:', error)
      });
  }

  configurarFiltros() {
    this.filtroForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(() => {
          this.cargando = true;
          return this.authService.filtrarLlamadas(this.filtroForm.value)
            .pipe(finalize(() => this.cargando = false));
        })
      )
      .subscribe({
        next: (llamadas) => this.llamadas = llamadas,
        error: (error) => console.error('Error al filtrar:', error)
      });
  }

  cargarTiposLlamada() {
    this.authService.getTiposLlamada().subscribe({
      next: (tipos) => this.tiposLlamada = tipos,
      error: (error) => console.error('Error cargando tipos:', error)
    });
  }

  limpiarFiltros() {
    this.filtroForm.reset();
    this.cargarLlamadasIniciales();
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}