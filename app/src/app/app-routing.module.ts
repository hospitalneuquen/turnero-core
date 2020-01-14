import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitorComponent } from './components/monitor/monitor.component';
import { SeleccionarVentanillaComponent } from './components/ventanilla/seleccionarVentanilla.component';
import { VentanillaComponent } from './components/ventanilla/ventanilla.component';
import { ListaVentanillasComponent } from './components/config/ventanillas.component';
import { TurnosComponent } from './components/config/turnos/turnos.component';


const routes: Routes = [
    { path: 'monitor', component: MonitorComponent },
    { path: 'ventanilla', component: SeleccionarVentanillaComponent },
    { path: 'ventanilla/:numero', component: VentanillaComponent },
    { path: 'config/ventanillas', component: ListaVentanillasComponent },
    { path: 'config/turnos', component: TurnosComponent },
    { path: '**', redirectTo: '/config/ventanillas' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
