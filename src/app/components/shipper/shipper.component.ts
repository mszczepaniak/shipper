import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';
import { RouteDataService } from '../../services/route-data/route-data.service';
import { RouteData } from '../../models/route-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.scss'],
})
export class ShipperComponent implements OnInit, OnDestroy {
  routes: RouteData[] = [];

  private routesSubscription: Subscription;


  constructor(
    private routeDataService: RouteDataService,
    private shipperStateService: ShipperStateService,
  ) {}

  ngOnInit() {
    this.routesSubscription  = this.routeDataService.loadRoutes().subscribe((routes: RouteData[]) => {
      this.routes = routes;
    });
  }

  onRouteSelected(route: RouteData | null) {
    this.shipperStateService.setSelectedRoute(route);
  }

  ngOnDestroy(): void {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }
}
