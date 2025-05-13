import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-telefono',
  standalone: false,
  templateUrl: './registrar-telefono.component.html',
  styleUrls: ['./registrar-telefono.component.css']
})
export class RegistrarTelefonoComponent {
  formulario: FormGroup;
  usuarioSeleccionado: any = null;
  usuariosEncontrados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      busqueda: [''],
      telefono: new FormControl<number | null>(null, [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
      ])
    });
  }

  ngOnInit() {
    this.configurarBusqueda();
  }

  configurarBusqueda() {
    this.formulario.get('busqueda')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          const searchTerm = query || '';
          if (searchTerm.length < 2) {
            this.usuariosEncontrados = [];
            return [];
          }
          return this.authService.buscarUsuarios(searchTerm);
        })
      )
      .subscribe(usuarios => this.usuariosEncontrados = usuarios);
  }

  seleccionarUsuario(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.usuariosEncontrados = [];
  }

  agregarTelefono() {
    if (this.formulario.valid && this.usuarioSeleccionado) {
      const nuevoTelefono = this.formulario.value.telefono;
      
      if (this.usuarioSeleccionado.Telefono.includes(nuevoTelefono)) {
        alert('Este número ya está registrado');
        return;
      }

      this.authService.agregarTelefono(
        this.usuarioSeleccionado._id, 
        nuevoTelefono
      ).subscribe({
        next: (usuarioActualizado) => {
          this.usuarioSeleccionado = usuarioActualizado;
          this.formulario.get('telefono')?.reset();
          alert('Número agregado correctamente');
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al agregar número');
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }
}