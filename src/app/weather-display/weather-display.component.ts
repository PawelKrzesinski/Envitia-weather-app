import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Subscription, of } from 'rxjs';
@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {
  private weatherData$: Subscription | undefined;
  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.weatherData$ = this.getAPIData().subscribe((data) => console.log('DATA: ', data))
  }
  getAPIData(): Observable<any>{
    const data = this.http.get('https://api.open-meteo.com/v1/forecast?latitude=50.72&longitude=-3.53&hourly=temperature_2m&forecast_days=5');
    return data;
  }
}
