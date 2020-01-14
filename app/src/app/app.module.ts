import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TurnosComponent } from './components/config/turnos/turnos.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { VentanillaComponent } from './components/ventanilla/ventanilla.component';
import { SeleccionarVentanillaComponent } from './components/ventanilla/seleccionarVentanilla.component';
import { TurnoComponent } from './components/turno/turno.component';
import { RelojComponent } from './components/reloj/reloj.component';
import { MenuComponent } from './components/menu/menu.component';
import { ListaVentanillasComponent } from './components/config/ventanillas.component';
import { PanelVentanillaComponent } from './components/config/panel-ventanilla.component';
import { TurnosService } from './services/turnos.service';
import { VentanillasService } from './services/ventanillas.service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        TurnosComponent,
        MonitorComponent,
        VentanillaComponent,
        SeleccionarVentanillaComponent,
        TurnoComponent,
        RelojComponent,
        MenuComponent,
        ListaVentanillasComponent,
        PanelVentanillaComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        CommonModule
    ],
    providers: [
        TurnosService,
        VentanillasService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
