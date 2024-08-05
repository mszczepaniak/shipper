import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteDataService } from '../../services/route-data/route-data.service';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';
import { RouteData } from '../../models/route-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-route-selector',
  templateUrl: './route-selector.component.html',
  styleUrls: ['./route-selector.component.scss'],
})
export class RouteSelectorComponent implements OnInit, OnDestroy {
  routes: RouteData[] = [];
  selectedRoute: RouteData | null = null;

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

  onRouteSelect(route: RouteData) {
    this.selectedRoute = route;
    this.shipperStateService.setSelectedRoute(route);
  }

  resetRoute() {
    this.selectedRoute = null;
    this.shipperStateService.setSelectedRoute(null);
  }

  ngOnDestroy(): void {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }
}
