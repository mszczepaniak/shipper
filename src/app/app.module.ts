import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShipperComponent } from './components/shipper/shipper.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { SpeedChartComponent } from './components/speed-chart/speed-chart.component';
import { RouteSelectorComponent } from './components/route-selector/route-selector.component';
import { MapComponent } from './components/map/map.component';
import { LegendComponent } from './components/legend/legend.component';
@NgModule({
  imports: [
    NgSelectModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BaseChartDirective,
  ],
  declarations: [
    AppComponent,
    ShipperComponent,
    SpeedChartComponent,
    RouteSelectorComponent,
    MapComponent,
    LegendComponent,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent],
})
export class AppModule {}
