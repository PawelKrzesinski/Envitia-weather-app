import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherDataService } from './services/weather-data.service';
import { Subscription } from 'rxjs';
import { WeatherData, TransformedWeatherDataByDay, TransformedWeatherDataByHour, ResponsiveSettings } from './weather.model';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  responsiveOptions: any[] = [];
  hours: string[] = [
    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00',
    '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
  ];
  timezone = '';
  day: TransformedWeatherDataByDay = {
    sunrise: '',
    sunset: '',
    time: '',
    temperature_2m_max: 1,
    temperature_2m_min: 1,
    weathercode: 0,
    weather_icon: '',
    hourly: {
      temperature_2m: [],
      apparent_temperature: [],
      is_day: [],
      precipitation_probability: [],
      surface_pressure: [],
      windspeed_10m: [],
      winddirection_10m: [],
      visibility: [],
      time: [],
      rain: [],
      showers: [],
      snowfall: [],
      weathercode: [],
    }
  }
  days: TransformedWeatherDataByDay[] = [this.day, this.day, this.day, this.day, this.day];
  selectedDay = this.days[0];
  activeIndex: number = 0;
  currentHourly:TransformedWeatherDataByHour = {
    feels_like: 0,
    temp: 0,
    precipitation: 0,
    pressure: 0,
    windspeed: 0,
    wind_direction: 0,
    visibility: 0,
    is_day: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
  }
  weatherIcon: string = '';
  locationForm: FormGroup;
  subscription: Subscription | undefined;
  constructor(private weatherDataService: WeatherDataService){
    this.locationForm = new FormGroup({
      lon: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|1[0-7]\d)(\.\d{1,2})?|180(\.0{1,2})?)$/)]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|[1-8]\d)(\.\d{1,2})?|90(\.0{1,2})?)$/)])
    });
  }
  ngOnInit(): void {
    this.subscription = this.weatherDataService.getAPIData('-3.53', '50.72').subscribe((data: WeatherData) => {
      this.days = this.weatherDataService.mapApiDataToObject(data, this.days, this.hours);
      this.setTempAndTimezone(data);
      this.currentHourly = this.extractDataByHour(this.days[0], this.getCurrentTime(), this.hours)

      console.log('DATA: ', data)
    });
    this.responsiveOptions = this.setResponsiveOptions();
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
    if (this.locationForm.valid) {
      const formData: { lat: number, lon: number } = this.locationForm.value;
      this.subscription = this.weatherDataService.getAPIData(formData.lon.toString(), formData.lat.toString()).subscribe((data: WeatherData) => {
        if (data) {
          this.days = this.weatherDataService.mapApiDataToObject(data, this.days, this.hours);
          this.setTempAndTimezone(data);
          this.currentHourly = this.extractDataByHour(this.days[0], this.getCurrentTime(), this.hours);
        }
      })
    }
  }
  
  dayChangeHandler(event: any): void{
    this.selectedDay = this.days[event.index];
  }
  
  extractDataByHour(day: TransformedWeatherDataByDay, hour: string, hours: string[]): TransformedWeatherDataByHour{
    return this.weatherDataService.extractDataByHour(day, hour, hours);
  }

  someMethod() {
    const days = this.days;
    days.forEach((day) => {
      const hourlyData: TransformedWeatherDataByHour[] = [];
    })
  }

  setTempAndTimezone(data: WeatherData): void{
    this.selectedDay = this.days[0];
    this.days[0].current_temp = Math.round(data.current_weather.temperature);
    this.timezone = data.timezone;
  }

  setResponsiveOptions(): ResponsiveSettings[] {
    return this.weatherDataService.responsiveOptions;
  }

  fetchWeatherIcon(code: number): string{
    console.log("CODE: ", code)
    return this.weatherDataService.getWeatherIcons(code)
  }

  getCurrentTime(): string{
    const date = new Date()
    let hour = date.getHours().toString();
    return `${hour}:00`;
  }
}
