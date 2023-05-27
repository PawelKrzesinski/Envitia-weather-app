import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherDataService } from './services/weather-data.service';
import { Subscription } from 'rxjs';
import { CurrentWeatherDataByHour, ResponsiveSettings, HourlyWeatherData, DailyWeatherData, CurrentWeatherData, MappedCurrentWeatherData } from './weather.model';
import * as DefaultData from './helpers/data-default-storage.helper';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  responsiveOptions: ResponsiveSettings[] = [];
  hours: string[] = [
    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00',
    '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
  ];
  timezone: string = '';
  day: HourlyWeatherData = DefaultData.day;
  currentWeatherData: MappedCurrentWeatherData = DefaultData.currentWeatherData;
  dailyWeatherData: DailyWeatherData = DefaultData.dailyWeatherData;
  hourlyWeatherData: HourlyWeatherData[] = [this.day, this.day, this.day, this.day, this.day];
  currentHourly: CurrentWeatherDataByHour = DefaultData.currentHourly;
  days = [0, 1, 2, 3, 4];
  selectedDay = this.hourlyWeatherData[0];
  activeIndex: number = 0;
  weatherIcon: string = '';
  locationForm: FormGroup;
  currentWeatherDataSub: Subscription | undefined;
  dailyWeatherDataSub: Subscription | undefined;
  hourlyWeatherDataSub: Subscription | undefined;

  constructor(private weatherDataService: WeatherDataService){
    this.locationForm = new FormGroup({
      lon: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|1[0-7]\d)(\.\d{1,2})?|180(\.0{1,2})?)$/)]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|[1-8]\d)(\.\d{1,2})?|90(\.0{1,2})?)$/)])
    });
  }

  ngOnInit(): void {
    this.currentWeatherDataSub = this.weatherDataService.getCurrentData('-3.53', '50.72').subscribe((data: CurrentWeatherData & { timezone: string}) => {
      this.currentWeatherData = this.weatherDataService.mapCurrentWeatherData(data);
      this.timezone = data.timezone;
    });
    this.dailyWeatherDataSub = this.weatherDataService.getDailyData('-3.53', '50.72').subscribe((data: {daily: DailyWeatherData }) => {
      this.dailyWeatherData = this.weatherDataService.mapDailyWeatherData(data.daily);
    })
    this.hourlyWeatherDataSub = this.weatherDataService.getHourlyData('-3.53', '50.72').subscribe((data: {hourly: HourlyWeatherData }) => {
      this.hourlyWeatherData = this.weatherDataService.mapHourlyWeatherData(data.hourly, this.hourlyWeatherData, this.hours);
      this.currentHourly = this.extractDataByHour(this.hourlyWeatherData[0], this.getCurrentTime(), this.hours);
      this.selectedDay = this.hourlyWeatherData[0];
    })
    this.responsiveOptions = this.weatherDataService.responsiveOptions;
  }
  ngOnDestroy() {
    this.currentWeatherDataSub?.unsubscribe();
    this.dailyWeatherDataSub?.unsubscribe();
    this.hourlyWeatherDataSub?.unsubscribe();
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
      this.currentWeatherDataSub = this.weatherDataService.getCurrentData('-3.53', '50.72').subscribe((data: CurrentWeatherData & { timezone: string}) => {
        this.currentWeatherData = this.weatherDataService.mapCurrentWeatherData(data);
        this.timezone = data.timezone;
      });
      this.dailyWeatherDataSub = this.weatherDataService.getDailyData('-3.53', '50.72').subscribe((data: {daily: DailyWeatherData }) => {
        this.dailyWeatherData = this.weatherDataService.mapDailyWeatherData(data.daily);
      })
      this.hourlyWeatherDataSub = this.weatherDataService.getHourlyData('-3.53', '50.72').subscribe((data: {hourly: HourlyWeatherData }) => {
        this.hourlyWeatherData = this.weatherDataService.mapHourlyWeatherData(data.hourly, this.hourlyWeatherData, this.hours);
        this.currentHourly = this.extractDataByHour(this.hourlyWeatherData[0], this.getCurrentTime(), this.hours);
        this.selectedDay = this.hourlyWeatherData[0];
      })
    }
  }
  
  dayChangeHandler(event: any): void{
    this.selectedDay = this.hourlyWeatherData[event.index];
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
