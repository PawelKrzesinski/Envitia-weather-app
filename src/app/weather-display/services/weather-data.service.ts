import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  constructor(private http: HttpClient){}

  getAPIData(lon: string, lat: string): Observable<any>{
    return this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,surface_pressure,visibility,windspeed_10m,winddirection_10m,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&current_weather=true&forecast_days=5`);
  }

}
