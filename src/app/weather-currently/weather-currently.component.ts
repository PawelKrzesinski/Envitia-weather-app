import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { WeatherDataService } from '../services/weather-data.service';
import { HourlyWeatherData, CurrentWeatherDataByHour } from '../weather-display/weather.model';
import * as DefaultData from '../helpers/data-default-storage.helper';
@Component({
  selector: 'app-weather-currently',
  templateUrl: './weather-currently.component.html',
  styleUrls: ['./weather-currently.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WeatherCurrentlyComponent implements OnInit, OnDestroy{
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

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }
}
