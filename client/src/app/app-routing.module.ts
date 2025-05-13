import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { RegistrarLlamadaComponent } from './registrar-llamada/registrar-llamada.component';
import { VerLlamadasComponent } from './ver-llamadas/ver-llamadas.component';
import { RegistrarTelefonoComponent } from './registrar-telefono/registrar-telefono.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'registrar-llamada', component: RegistrarLlamadaComponent, canActivate: [AuthGuard] },
  { path: 'ver-llamadas', component: VerLlamadasComponent, canActivate: [AuthGuard] },
  { path: 'registrar-telefono', component: RegistrarTelefonoComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
