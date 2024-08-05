import { Component } from '@angular/core';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent {
  selectedRoute$ = this.shipperStateService.selectedRoute$;

  constructor(private shipperStateService: ShipperStateService) {}
}
