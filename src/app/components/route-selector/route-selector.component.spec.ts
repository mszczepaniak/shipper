import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteSelectorComponent } from './route-selector.component';
import { RouteDataService } from '../../services/route-data/route-data.service';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';
import { of } from 'rxjs';
import { RouteData } from '../../models/route-model';
import { expect } from '@jest/globals';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

describe('RouteSelectorComponent', () => {
  let component: RouteSelectorComponent;
  let fixture: ComponentFixture<RouteSelectorComponent>;
  let mockRouteDataService: Partial<RouteDataService>;
  let mockShipperStateService: Partial<ShipperStateService>;

  beforeEach(async () => {
    mockRouteDataService = {
      loadRoutes: jest.fn().mockReturnValue(of([])),
    };

    mockShipperStateService = {
      setSelectedRoute: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RouteSelectorComponent],
      imports: [NgSelectModule, FormsModule],
      providers: [
        { provide: RouteDataService, useValue: mockRouteDataService },
        { provide: ShipperStateService, useValue: mockShipperStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load routes on init', () => {
    const mockRoutes: RouteData[] = [
      {
        routeId: '1',
        fromPort: 'A',
        toPort: 'B',
        legDuration: '10',
        points: [],
      },
      {
        routeId: '2',
        fromPort: 'C',
        toPort: 'D',
        legDuration: '5',
        points: [],
      },
    ];
    mockRouteDataService.loadRoutes = jest.fn().mockReturnValue(of(mockRoutes));

    component.ngOnInit();

    expect(component.routes).toEqual(mockRoutes);
  });

  it('should select a route', () => {
    const mockRoute: RouteData = {
      routeId: '1',
      fromPort: 'A',
      toPort: 'B',
      legDuration: '10',
      points: [],
    };
    component.onRouteSelect(mockRoute);

    expect(component.selectedRoute).toEqual(mockRoute);
    expect(mockShipperStateService.setSelectedRoute).toHaveBeenCalledWith(
      mockRoute,
    );
  });

  it('should reset route selection', () => {
    component.resetRoute();

    expect(component.selectedRoute).toBeNull();
    expect(mockShipperStateService.setSelectedRoute).toHaveBeenCalledWith(null);
  });
});
