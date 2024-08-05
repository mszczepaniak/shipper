import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RouteData } from '../../models/route-model';
import { RouteDataService } from '../route-data/route-data.service';

@Injectable({
  providedIn: 'root',
})
export class ShipperStateService implements OnDestroy {
  private routesSubject = new BehaviorSubject<RouteData[]>([]);
  private selectedRouteSubject = new BehaviorSubject<RouteData | null>(null);
  private routesSubscription: Subscription;

  routes$: Observable<RouteData[]> = this.routesSubject.asObservable();
  selectedRoute$: Observable<RouteData | null> =
    this.selectedRouteSubject.asObservable();

  constructor(private routeDataService: RouteDataService) {}

  setSelectedRoute(route: RouteData | null) {
    this.selectedRouteSubject.next(route);
  }

  loadRoutes() {
    this.routesSubscription = this.routeDataService.loadRoutes().subscribe((routes) => {
      this.routesSubject.next(routes);
    });
  }

  ngOnDestroy(): void {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }
}
