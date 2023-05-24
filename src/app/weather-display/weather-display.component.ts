import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherDataService } from './services/weather-data.service';
import { Subscription, of, throwError } from 'rxjs';


type Temperatures = {
  lowest: number[],
  highest: number[]
}

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  current: number = 0;
  temperatures: Temperatures = {
    lowest: [],
    highest: []
  }
  locationForm: FormGroup;
  timezone: string = '';
  subscription: Subscription | undefined;
  constructor(private weatherDataService: WeatherDataService){
    this.locationForm = new FormGroup({
      lon: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)])
    });
  }
  ngOnInit(): void {
    this.subscription = this.weatherDataService.getAPIData('-3.53', '50.72').subscribe((data) => {
      console.log('DATA: ', data)
      this.current = Math.round(data.current_weather.temperature);
      this.temperatures.lowest = data.daily.temperature_2m_min;
      this.temperatures.highest = data.daily.temperature_2m_max;
    })
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  get lon() {
    return this.locationForm.get('lon');
  }

  get lat() {
    return this.locationForm.get('lat');
  }

  getWeatherByLonLat(){
    const defaultData = {
      current_weather: { 
        temperature: 0 
      }, 
      daily: {
        temperature_2m_min: [0, 0, 0, 0, 0],
        temperature_2m_max: [0, 0, 0, 0, 0]
      }
    }
    if (this.locationForm.valid) {
      const formData: { lat: number, lon: number } = this.locationForm.value;
      this.subscription = this.weatherDataService.getAPIData(formData.lon.toString(), formData.lat.toString()).pipe((err) => {
        console.error('API request error:', err);
        return of(defaultData) // if the call fails or errors for any reason we want to return an observable with some default values
      })
      .subscribe((data) => {
        if (data) {
          this.current = Math.round(data.current_weather.temperature);
          this.temperatures.lowest = data.daily.temperature_2m_min;
          this.temperatures.highest = data.daily.temperature_2m_max;
        }
      })
    } else {
      // Handle form validation errors
    }
  }
}
