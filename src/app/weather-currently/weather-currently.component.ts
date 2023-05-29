import { Component, OnInit } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { WeatherDataService } from '../services/weather-data.service';
import { HourlyWeatherData, CurrentWeatherDataByHour } from '../weather-display/weather.model';
import * as DefaultData from '../helpers/data-default-storage.helper';
@Component({
  selector: 'app-weather-currently',
  templateUrl: './weather-currently.component.html',
  styleUrls: ['./weather-currently.component.css']
})
export class WeatherCurrentlyComponent implements OnInit {
  hourlyWeatherData: HourlyWeatherData[] = [];
  subscription: Subscription | undefined;
  currentHourly: CurrentWeatherDataByHour = DefaultData.currentHourly;
  hours: string[] = [];

  constructor(private weatherDataService: WeatherDataService){
    this.hours = this.weatherDataService.hours;
  }

  ngOnInit(): void {
    this.subscription = this.weatherDataService.hourlyData$.pipe(
      filter((data) => !!data)
    ).subscribe((data: { hourly: HourlyWeatherData}) => {
      this.currentHourly = this.weatherDataService.extractDataByHour(data.hourly, this.getCurrentTime(), this.hours);
    });
  }

  getCurrentTime(): string{
    return this.weatherDataService.getCurrentTime();
  }







  // this.currentHourly = this.extractDataByHour(hourlyWeatherData[0], this.getCurrentTime(), this.hours);
}
