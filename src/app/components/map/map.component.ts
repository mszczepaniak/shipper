import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';
import { RouteData } from '../../models/route-model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedRoute: RouteData | null = null;
  map!: mapboxgl.Map;
  private selectedRouteSubscription: Subscription;

  constructor(private shipperStateService: ShipperStateService) {}

  ngOnInit() {
    this.selectedRouteSubscription =
      this.shipperStateService.selectedRoute$.subscribe((route) => {
        if (route) {
          this.selectedRoute = route;
          this.updateRoute(route);
        } else {
          this.resetMap();
        }
      });
  }

  resetMap() {
    if (this.map) {
      if (this.map.getLayer('route')) {
        this.map.removeLayer('route');
      }

      if (this.map.getSource('route')) {
        this.map.removeSource('route');
      }

      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers.length > 0) {
        markers[0].remove();
      }

      // Reset the map view to global
      this.map.flyTo({
        center: [0, 0],
        zoom: 2,
        essential: true,
      });
    }
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      accessToken:
        'pk.eyJ1Ijoic3pjemVwYW5pYWsiLCJhIjoiY2x5enIxMXQ0Mm9oZjJxczYyMmx5aThmeCJ9.QqEC1BYZUkowLQOhAXGX9w',
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });

    this.map.on('load', () => {
      this.updateRoute(this.selectedRoute);
    });
  }

  updateRoute(route: RouteData | null) {
    if (!this.map || !route) return;

    if (this.map.getSource('route')) {
      (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(
        this.createRouteGeoJSON(route),
      );
    } else {
      this.addRouteToMap(route);
    }

    this.fitMapToRoute(route);
    this.addStartEndMarkers(route);
  }

  addRouteToMap(route: RouteData) {
    this.map.addSource('route', {
      type: 'geojson',
      data: this.createRouteGeoJSON(route),
    });

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 3,
      },
    });
  }

  createRouteGeoJSON(route: RouteData): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = route.points
      .map((point, index, array) => {
        if (index === array.length - 1) return null; // Skip the last point

        const nextPoint = array[index + 1];
        return {
          type: 'Feature',
          properties: {
            color: this.getColorForSpeed(point.speed || 0),
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [point.longitude, point.latitude],
              [nextPoint.longitude, nextPoint.latitude],
            ],
          },
        };
      })
      .filter((feature) => feature !== null) as GeoJSON.Feature[];

    return {
      type: 'FeatureCollection',
      features: features,
    };
  }

  fitMapToRoute(route: RouteData) {
    const coordinates = route.points.map(
      (point) => [point.longitude, point.latitude] as [number, number],
    );
    const bounds = coordinates.reduce(
      (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
        return bounds.extend(coord as mapboxgl.LngLatLike);
      },
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
    );

    this.map.fitBounds(bounds, { padding: 50 });
  }

  addStartEndMarkers(route: RouteData) {
    const existingMarkers = document.getElementsByClassName('start-end-marker');
    while (existingMarkers.length > 0) {
      existingMarkers[0].parentNode?.removeChild(existingMarkers[0]);
    }

    if (route.points.length > 0) {
      const startPoint = route.points[0];
      const endPoint = route.points[route.points.length - 1];

      new mapboxgl.Marker({ color: 'green' })
        .setLngLat([startPoint.longitude, startPoint.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(
            `Start Point: ${route.fromPort}`,
          ),
        )
        .addTo(this.map)
        .getElement()
        .classList.add('start-end-marker');

      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([endPoint.longitude, endPoint.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(
            `End Point: ${route.toPort}`,
          ),
        )
        .addTo(this.map)
        .getElement()
        .classList.add('start-end-marker');
    }
  }

  getColorForSpeed(speed) {
    const minSpeed = 0;
    const maxSpeed = 24;
    const normalizedSpeed = Math.min(
      Math.max((speed - minSpeed) / (maxSpeed - minSpeed), 0),
      1,
    );
    if (normalizedSpeed === 0) {
      return '#fff';
    } else if (normalizedSpeed < 0.15) {
      return '#006400';
    } else if (normalizedSpeed < 0.25) {
      return '#008000';
    } else if (normalizedSpeed < 0.35) {
      return '#00ff00';
    } else if (normalizedSpeed < 0.56) {
      return '#ffff00';
    } else if (normalizedSpeed < 0.65) {
      return '#ff8c00';
    } else if (normalizedSpeed < 0.75) {
      return '#ff0000';
    } else if (normalizedSpeed < 0.8) {
      return '#d20303';
    } else if (normalizedSpeed < 0.83) {
      return '#c00505';
    } else if (normalizedSpeed < 0.88) {
      return '#921c1c';
    } else {
      return '#8b0000';
    }
  }
  #d20303
  ngOnDestroy() {
    if (this.selectedRouteSubscription) {
      this.selectedRouteSubscription.unsubscribe();
    }
  }
}
