import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';
import { BehaviorSubject } from 'rxjs';
import { RouteData } from '../../models/route-model';
import { expect } from '@jest/globals';

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    fitBounds: jest.fn(),
    getSource: jest.fn(),
    getLayer: jest.fn(),
    removeLayer: jest.fn(),
    removeSource: jest.fn(),
    flyTo: jest.fn(),
  })),
  LngLatBounds: jest.fn().mockImplementation(() => ({
    extend: jest.fn(),
  })),
  Marker: jest.fn().mockImplementation(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    getElement: jest.fn().mockReturnValue({ classList: { add: jest.fn() } }),
  })),
  Popup: jest.fn().mockImplementation(() => ({
    setText: jest.fn().mockReturnThis(),
  })),
}));

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockShipperStateService: Partial<ShipperStateService>;

  beforeEach(async () => {
    mockShipperStateService = {
      selectedRoute$: new BehaviorSubject<RouteData | null>(null),
    };

    await TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [
        { provide: ShipperStateService, useValue: mockShipperStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize map', () => {
    component.initializeMap();
    expect(component.map).toBeTruthy();
  });

  it('should update route when a new route is selected', () => {
    const mockRoute: RouteData = {
      routeId: '1',
      fromPort: 'Port A',
      toPort: 'Port B',
      legDuration: '10',
      points: [
        { longitude: 0, latitude: 0, timestamp: 0, speed: 10 },
        { longitude: 1, latitude: 1, timestamp: 3600000, speed: 15 },
      ],
    };

    component.initializeMap();
    const updateRouteSpy = jest.spyOn(component, 'updateRoute');

    (
      mockShipperStateService.selectedRoute$ as BehaviorSubject<RouteData | null>
    ).next(mockRoute);
    fixture.detectChanges();

    expect(updateRouteSpy).toHaveBeenCalledWith(mockRoute);
  });

  it('should reset map when no route is selected', () => {
    component.initializeMap();
    const resetMapSpy = jest.spyOn(component, 'resetMap');

    (
      mockShipperStateService.selectedRoute$ as BehaviorSubject<RouteData | null>
    ).next(null);
    fixture.detectChanges();

    expect(resetMapSpy).toHaveBeenCalled();
  });
});
