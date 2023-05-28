import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherDataService } from './services/weather-data.service';
import { Observable, map, tap } from 'rxjs';
import { CurrentWeatherDataByHour, ResponsiveSettings, HourlyWeatherData, DailyWeatherData } from './weather.model';
import * as DefaultData from './helpers/data-default-storage.helper';
import * as DataHandling from './helpers/data-handling.helper';
@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {
  responsiveOptions: ResponsiveSettings[] = [];
  hours: string[] = [
    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00',
    '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
  ];
  timezone: string = '';
  dailyWeatherData$: Observable<DailyWeatherData> | undefined;
  hourlyWeatherData$: Observable<HourlyWeatherData[]> | undefined;
  dates: string[] = [];
  currentHourly: CurrentWeatherDataByHour = DefaultData.currentHourly;
  days = [0, 1, 2, 3, 4];
  selectedDay: number = 0;
  activeIndex: number = 0;
  weatherCodes: number[] = [];
  locationForm: FormGroup;

  constructor(private weatherDataService: WeatherDataService){
    this.locationForm = new FormGroup({
      lon: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|1[0-7]\d)(\.\d{1,2})?|180(\.0{1,2})?)$/)]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|[1-8]\d)(\.\d{1,2})?|90(\.0{1,2})?)$/)])
    });
  }

  ngOnInit(): void {
    this.dailyWeatherData$ = this.weatherDataService.getDailyData('-3.53', '50.72').pipe(
      map((data: { daily: DailyWeatherData, timezone: string }) =>{
        this.timezone = data.timezone;
        this.dates = DataHandling.changeDateFormat(data.daily.time);
        if(this.dates[0]) this.dates[0] = this.dates[0] +"(Today)";
        this.weatherCodes = data.daily.weathercode;
        return this.weatherDataService.mapDailyWeatherData(data.daily)
      })
    );
    this.hourlyWeatherData$ = this.weatherDataService.getHourlyData('-3.53', '50.72').pipe(
      map((data: { hourly: HourlyWeatherData }) => {
        return this.weatherDataService.mapHourlyWeatherData(data.hourly, this.hours);
      }),
      tap((hourlyWeatherData) => {
        this.currentHourly = this.extractDataByHour(hourlyWeatherData[0], this.getCurrentTime(), this.hours);
      })
    );
    this.responsiveOptions = this.weatherDataService.responsiveOptions;
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
      this.dailyWeatherData$ = this.weatherDataService.getDailyData(formData.lon.toString(), formData.lat.toString()).pipe(
        map((data: { daily: DailyWeatherData, timezone: string }) =>{
          this.timezone = data.timezone;
          this.dates = DataHandling.changeDateFormat(data.daily.time);
          if(this.dates[0]) this.dates[0] = this.dates[0] +"(Today)";
          this.weatherCodes = data.daily.weathercode;
          return this.weatherDataService.mapDailyWeatherData(data.daily)
        })
      );
      this.hourlyWeatherData$ = this.weatherDataService.getHourlyData(formData.lon.toString(), formData.lat.toString()).pipe(
        map((data: { hourly: HourlyWeatherData }) => {
          return this.weatherDataService.mapHourlyWeatherData(data.hourly, this.hours);
        }),
        tap((hourlyWeatherData) => {
          this.currentHourly = this.extractDataByHour(hourlyWeatherData[0], this.getCurrentTime(), this.hours);
        })
      );
    }
  }
  
  dayChangeHandler(event: any): void{
    this.selectedDay = event.index;
    this.activeIndex = event.index;
  }
  
  extractDataByHour(day: HourlyWeatherData, hour: string, hours: string[]): CurrentWeatherDataByHour{
    return this.weatherDataService.extractDataByHour(day, hour, hours)
  }

  fetchWeatherIcon(code: number): string{
    return this.weatherDataService.getWeatherIcons(code)
  }

  getCurrentTime(): string{
    const date = new Date()
    let hour = date.getHours().toString();
    return `${hour}:00`;
  }
}
