import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouteDataService } from './route-data.service';
import { Papa } from 'ngx-papaparse';
import { expect } from '@jest/globals';

describe('RouteDataService', () => {
  let service: RouteDataService;
  let httpMock: HttpTestingController;
  let mockPapa: Partial<Papa>;

  beforeEach(() => {
    mockPapa = {
      parse: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RouteDataService, { provide: Papa, useValue: mockPapa }],
    });

    service = TestBed.inject(RouteDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load routes from CSV', (done) => {
    const mockCSV = `route_id,from_port,to_port,leg_duration,points
1,Port A,Port B,10h,"[[0,0,0,10],[1,1,3600000,15]]"`;

    const expectedRoutes = [
      {
        routeId: '1',
        fromPort: 'Port A',
        toPort: 'Port B',
        legDuration: '10h',
        points: [
          { longitude: 0, latitude: 0, timestamp: 0, speed: 10 },
          { longitude: 1, latitude: 1, timestamp: 3600000, speed: 15 },
        ],
      },
    ];

    (mockPapa.parse as jest.Mock).mockImplementation((csv, options) => {
      options.complete({
        data: [
          {
            route_id: '1',
            from_port: 'Port A',
            to_port: 'Port B',
            leg_duration: '10h',
            points: '[[0,0,0,10],[1,1,3600000,15]]',
          },
        ],
      });
    });

    service.loadRoutes().subscribe((routes) => {
      expect(routes).toEqual(expectedRoutes);
      done();
    });

    const req = httpMock.expectOne('assets/route_data.csv');
    expect(req.request.method).toBe('GET');
    req.flush(mockCSV);
  });
});
// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { RouteDataService } from './route-data.service';

// describe('RouteDataService', () => {
//   let service: RouteDataService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [RouteDataService],
//     });
//     service = TestBed.inject(RouteDataService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should load routes', (done) => {
//     const mockCsvData = `index,fromPort,toPort,routeId,legDuration,points
//   1,DEWVN,DEBRV,1,61904645,"[[8.138572,53.637016,1498311135548,11.2]]"`;

//     service.loadRoutes().subscribe((routes) => {
//       expect(routes.length).toBe(1);
//       expect(routes[0].routeId).toBe('1');
//       expect(routes[0].fromPort).toBe('DEWVN');
//       expect(routes[0].toPort).toBe('DEBRV');
//       expect(routes[0].legDuration).toBe('61904645');
//       expect(routes[0].points.length).toBe(1);
//       done();
//     });

//     const req = httpMock.expectOne('assets/route_data.csv');
//     expect(req.request.method).toBe('GET');
//     req.flush(mockCsvData);
//   });

//   it('should get route by id', () => {
//     const mockRoute = { routeId: '1', fromPort: 'A', toPort: 'B', legDuration: '3600', points: [] };
//     (service as any).routes = [mockRoute];

//     const result = service.getRouteById('1');
//     expect(result).toEqual(mockRoute);
//   });
// });
