import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RouteData, RoutePoint } from '../../models/route-model';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root',
})
export class RouteDataService {
  private routesSubject = new Subject<RouteData[]>();

  constructor(
    private http: HttpClient,
    private papa: Papa,
  ) {}

  loadRoutes(): Observable<RouteData[]> {
    this.http
      .get('assets/route_data.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.parseCSV(data);
      });

    return this.routesSubject.asObservable();
  }

  parseCSV(csv: string): void {
    const routes: RouteData[] = [];

    this.papa.parse(csv, {
      worker: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row) => {
          try {
            const pointsArray = JSON.parse(row.points);
            const points: RoutePoint[] = pointsArray.map((point: number[]) => ({
              longitude: point[0],
              latitude: point[1],
              timestamp: point[2],
              speed: point[3] !== null ? point[3] : null,
            }));

            routes.push({
              routeId: row.route_id,
              fromPort: row.from_port,
              toPort: row.to_port,
              legDuration: row.leg_duration,
              points,
            });
          } catch (e) {}
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
    this.routesSubject.next(routes);
  }
}
