import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-registrar-llamada',
  standalone: false,
  templateUrl: './registrar-llamada.component.html',
  styleUrls: ['./registrar-llamada.component.css']
})
export class RegistrarLlamadaComponent implements OnInit {
  formulario: FormGroup;
  usuariosEncontrados: any[] = [];
  tiposLlamada: any[] = [];
  telefonosUsuario: number[] = [];
  total = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      busqueda: [''],
      usuarioSeleccionado: [null, Validators.required],
      telefono: ['', Validators.required],
      numeroMarcado: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      tipoLlamada: ['', Validators.required],
      minutos: [0, [Validators.required, Validators.min(1)]],
      fecha: [new Date().toISOString().substring(0, 16), Validators.required]
    });
  }

  ngOnInit() {
    this.cargarTiposLlamada();
    this.configurarBusqueda();
  }

  configurarBusqueda() {
    this.formulario.get('busqueda')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query.length < 2) {
            this.usuariosEncontrados = [];
            return of([]);
          }
          return this.authService.buscarUsuarios(query).pipe(
            catchError(error => {
              console.error('Error:', error);
              return of([]);
            })
          );
        })
      )
      .subscribe(usuarios => {
        this.usuariosEncontrados = usuarios;
      });
  }

  cargarTiposLlamada() {
    this.authService.getTiposLlamada().subscribe(tipos => {
      this.tiposLlamada = tipos;
    });
  }

  seleccionarUsuario(usuario: any) {
    this.formulario.patchValue({ usuarioSeleccionado: usuario.ClaveUsuario });
    this.telefonosUsuario = usuario.Telefono;
  }

  calcularTotal() {
    const tipo = this.tiposLlamada.find(t => t._id === this.formulario.value.tipoLlamada);
    const minutos = this.formulario.value.minutos;
    this.total = tipo ? tipo.costoPorMinuto * minutos : 0;
  }

  enviarRegistro() {
    if (this.formulario.valid) {
      const datos = {
        claveUsuario: this.formulario.value.usuarioSeleccionado,
        numeroTelefono: this.formulario.value.telefono.toString(), // Convertir a string
        numeroMarcado: this.formulario.value.numeroMarcado.toString(),
        tipoLlamada: this.formulario.value.tipoLlamada,
        minutosUtilizados: Number(this.formulario.value.minutos), // Asegurar número
        fechaLlamada: new Date(this.formulario.value.fecha) // Convertir a Date
      };


      this.authService.registrarLlamada(datos).subscribe({
        next: () => {
          alert('Llamada registrada correctamente');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al registrar:', error);
          alert('Error al registrar la llamada');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home']);
  }
}