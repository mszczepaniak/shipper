export interface RouteData {
  routeId: string;
  fromPort: string;
  toPort: string;
  legDuration: string;
  points: RoutePoint[];
}

export interface RoutePoint {
  longitude: number;
  latitude: number;
  timestamp: number;
  speed: number;
}
