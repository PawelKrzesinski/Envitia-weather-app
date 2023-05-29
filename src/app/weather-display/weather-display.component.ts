import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WeatherDataService } from '../services/weather-data.service';
import { Observable, map, tap } from 'rxjs';
import { CurrentWeatherDataByHour, ResponsiveSettings, HourlyWeatherData, DailyWeatherData } from './weather.model';
import * as DefaultData from '../helpers/data-default-storage.helper';
import * as DataHandling from '../helpers/data-handling.helper';
@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WeatherDisplayComponent implements OnInit {
  responsiveOptions: ResponsiveSettings[] = []; 
  hourlyWeatherData$: Observable<HourlyWeatherData[]> | undefined;
  currentHourly: CurrentWeatherDataByHour = DefaultData.currentHourly;
  hours: string[] = []

  constructor(private weatherDataService: WeatherDataService){
    this.hours = this.weatherDataService.hours;
  }

  ngOnInit(): void {
    this.responsiveOptions = this.weatherDataService.responsiveOptions;
    }
    
    // this.currentHourly = this.extractDataByHour(hourlyWeatherData[0], this.getCurrentTime(), this.hours);
    getCurrentTime(){
      return this.weatherDataService.getCurrentTime();
    }



}
