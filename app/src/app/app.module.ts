import { ExtraService } from './services/extra-service';
// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';
// Globales
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Servicios
import { TurnosService } from './services/turnos.service';
import { VentanillasService } from './services/ventanillas.service';

// Componentes Front
import { AppComponent } from './app.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { VentanillaComponent } from './components/ventanilla/ventanilla.component';
import { SeleccionarVentanillaComponent } from './components/ventanilla/seleccionarVentanilla.component';
import { TurnoComponent } from './components/turno/turno.component';
import { RelojComponent } from './components/reloj/reloj.component';
import { MenuComponent } from './components/menu/menu.component';

// Compontentes Back
import { ListaVentanillasComponent } from './components/config/ventanillas/ventanillas.component';
import { PanelVentanillaComponent } from './components/config/ventanillas/panel-ventanilla.component';
import { ListaTurnosComponent } from './components/config/turnos/lista-turnos.component';
import { PanelTurnoComponent } from './components/config/turnos/panel-turno/panel-turno.component';
import { RolloComponent } from './components/config/turnos/rollo/rollo.component';


// Define the routes
const ROUTES = [
    { path: '', redirectTo: 'ventanilla', pathMatch: 'full' },
    { path: 'monitor', component: MonitorComponent },
    { path: 'ventanilla', component: SeleccionarVentanillaComponent },
    { path: 'ventanilla/:numero', component: VentanillaComponent },
    { path: 'config/ventanillas', component: ListaVentanillasComponent },
    { path: 'config/turnos', component: ListaTurnosComponent },
    { path: 'config/turnos/rollo', component: RolloComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        ListaTurnosComponent,
        MonitorComponent,
        VentanillaComponent,
        SeleccionarVentanillaComponent,
        TurnoComponent,
        RelojComponent,
        MenuComponent,
        ListaVentanillasComponent,
        PanelVentanillaComponent,
        PanelTurnoComponent,
        RolloComponent
    ],
    imports: [
        // PlexModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES),
        NgbModule.forRoot()
    ],
    providers: [
        TurnosService,
        VentanillasService,
        ExtraService
        // Plex,
        // Server
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
