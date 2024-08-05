import { TestBed } from '@angular/core/testing';
import { ShipperStateService } from './shipper-state.service';
import { RouteDataService } from '../route-data/route-data.service';
import { of } from 'rxjs';
import { RouteData } from '../../models/route-model';
import { expect } from '@jest/globals';

describe('ShipperStateService', () => {
  let service: ShipperStateService;
  let mockRouteDataService: Partial<RouteDataService>;

  beforeEach(() => {
    mockRouteDataService = {
      loadRoutes: jest.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        ShipperStateService,
        { provide: RouteDataService, useValue: mockRouteDataService },
      ],
    });
    service = TestBed.inject(ShipperStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set selected route', (done) => {
    const mockRoute: RouteData = {
      routeId: '1',
      fromPort: 'A',
      toPort: 'B',
      legDuration: '10h',
      points: [],
    };
    service.setSelectedRoute(mockRoute);
    service.selectedRoute$.subscribe((route) => {
      expect(route).toEqual(mockRoute);
      done();
    });
  });

  it('should load routes', (done) => {
    const mockRoutes: RouteData[] = [
      {
        routeId: '1',
        fromPort: 'A',
        toPort: 'B',
        legDuration: '10h',
        points: [],
      },
      {
        routeId: '2',
        fromPort: 'C',
        toPort: 'D',
        legDuration: '5h',
        points: [],
      },
    ];
    mockRouteDataService.loadRoutes = jest.fn().mockReturnValue(of(mockRoutes));

    service.loadRoutes();
    service.routes$.subscribe((routes) => {
      expect(routes).toEqual(mockRoutes);
      done();
    });
  });
});
// import { TestBed } from '@angular/core/testing';
// import { ShipperStateService } from './shipper-state.service';
// import { RouteDataService } from './route-data/route-data.service';
// import { of } from 'rxjs';

// describe('ShipperStateService', () => {
//   let service: ShipperStateService;
//   let routeDataServiceMock: jest.Mocked<RouteDataService>;

//   beforeEach(() => {
//     routeDataServiceMock = {
//       loadRoutes: jest.fn(),
//     } as any;

//     TestBed.configureTestingModule({
//       providers: [
//         ShipperStateService,
//         { provide: RouteDataService, useValue: routeDataServiceMock },
//       ],
//     });
//     service = TestBed.inject(ShipperStateService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should set selected route', (done) => {
//     const testRoute = { routeId: '1', fromPort: 'A', toPort: 'B', legDuration: '111222333', points: [] };
//     service.setSelectedRoute(testRoute);
//     service.selectedRoute$.subscribe((route) => {
//       expect(route).toEqual(testRoute);
//       done();
//     });
//   });

//   it('should load routes', () => {
//     const testRoutes = [{ routeId: '1', fromPort: 'A', toPort: 'B', legDuration: '111222333', points: [] }];
//     routeDataServiceMock.loadRoutes.mockReturnValue(of(testRoutes));

//     service.loadRoutes();

//     expect(routeDataServiceMock.loadRoutes).toHaveBeenCalled();
//     service.routes$.subscribe((routes) => {
//       expect(routes).toEqual(testRoutes);
//     });
//   });

//   it('should get color for speed', () => {
//     const color = service.getColorForSpeed(10);
//     expect(color).toBe('rgb(128, 0, 128)');
//   });
// });
