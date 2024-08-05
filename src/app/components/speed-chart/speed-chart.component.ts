import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ShipperStateService } from '../../services/shipper-state/shipper-state.service';
import { Subscription } from 'rxjs';
import { RouteData } from '../../models/route-model';

@Component({
  selector: 'app-speed-chart',
  templateUrl: './speed-chart.component.html',
  styleUrls: ['./speed-chart.component.scss'],
})
export class SpeedChartComponent implements OnInit, OnChanges, OnDestroy {
  private selectedRouteSubscription: Subscription;
  selectedRoute: RouteData | null = null;

  constructor(private shipperStateService: ShipperStateService) {}

  ngOnInit() {
    this.selectedRouteSubscription =
      this.shipperStateService.selectedRoute$.subscribe((route) => {
        this.selectedRoute = route;
        this.updateChartData();
      });
  }

  public lineChartData: ChartData<'line'> | null = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Speed',
        fill: false,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Route duration [h]',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Velocity [knots]',
        },
        beginAtZero: true,
      },
    },
  };

  ngOnChanges(changes): void {
    if (changes.selectedRoute && this.selectedRoute) {
      this.updateChartData();
    }
  }

  ngOnDestroy() {
    if (this.selectedRouteSubscription) {
      this.selectedRouteSubscription.unsubscribe();
    }
  }

  updateChartData() {
    if (!this.selectedRoute) {
      this.lineChartData = null;
      return;
    }

    const firstTimestamp = this.selectedRoute.points[0].timestamp;

    const labels = this.selectedRoute.points.map((_) => {
      let durationInMiliseconds = _.timestamp - firstTimestamp;
      let durationInHours = Math.trunc(durationInMiliseconds / 360000);
      return durationInHours;
    });

    const data = this.selectedRoute.points.map((point) => point.speed || 0);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Speed',
          fill: false,
        },
      ],
    };
  }
}
