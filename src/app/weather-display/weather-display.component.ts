import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


type Temperatures = {
  lowest: number[],
  highest: number[]
}

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {
  current: number = 0;
  temperatures: Temperatures = {
    lowest: [],
    highest: []
  }
  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.getAPIData().subscribe((data) => {
      console.log('DATA: ', data)
      this.current = Math.round(data.current_weather.temperature);
      this.temperatures.lowest = data.daily.temperature_2m_min;
      this.temperatures.highest = data.daily.temperature_2m_max;
    })
  }
  getAPIData(): Observable<any>{
    return this.http.get('https://api.open-meteo.com/v1/forecast?latitude=50.72&longitude=-3.53&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,surface_pressure,visibility,windspeed_10m,winddirection_10m,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&current_weather=true&forecast_days=5');
  }
}
