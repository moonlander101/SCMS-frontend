import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, NgZone } from '@angular/core';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [],
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapDiv!: ElementRef;
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  map!: L.Map;
  marker!: L.Marker;
  lat = 7.8731;
  lng = 80.7718;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapDiv.nativeElement).setView([this.lat, this.lng], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Listen for map clicks
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.updateMarker(lat, lng, '📍 Selected location');
    });
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          this.zone.run(() => {
            this.lat = userLat;
            this.lng = userLng;
          });

          this.map.setView([userLat, userLng], 15);
          this.updateMarker(userLat, userLng, '📍 You are here');

          // Optional circle to show accuracy
          L.circle([userLat, userLng], {
            radius: position.coords.accuracy,
            color: 'blue',
            fillOpacity: 0.2
          }).addTo(this.map);

          this.locationSelected.emit({ lat: userLat, lng: userLng });
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          alert('Unable to get location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation not supported by your browser.');
    }
  }

  private updateMarker(lat: number, lng: number, label: string): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup(label)
      .openPopup();

    this.zone.run(() => {
      this.lat = lat;
      this.lng = lng;
    });

    this.locationSelected.emit({ lat, lng });
  }
}
