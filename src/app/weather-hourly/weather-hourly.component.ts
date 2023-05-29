import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription, filter } from 'rxjs';
import { HourlyWeatherData, ResponsiveSettings } from '../weather-display/weather.model';
import { WeatherDataService } from '../services/weather-data.service';

@Component({
  selector: 'app-weather-hourly',
  templateUrl: './weather-hourly.component.html',
  styleUrls: ['./weather-hourly.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WeatherHourlyComponent implements OnInit, OnDestroy {
  hourlyWeatherData$: Observable<HourlyWeatherData> | undefined;
  hourlyWeatherData: HourlyWeatherData[] = [];
  activeIndexSub: Subscription | undefined;
  activeIndex: number = 0;
  hours: string[] = [];
  responsiveOptions: ResponsiveSettings[] = [];
  hourlyDataSub: Subscription | undefined;
  constructor(private weatherDataService: WeatherDataService){
    this.hours = this.weatherDataService.hours;
    this.responsiveOptions = this.weatherDataService.responsiveOptions;
  }

  ngOnInit(): void {
    this.hourlyDataSub = this.weatherDataService.hourlyData$.pipe(
      filter((data) => !!data)
    ).subscribe((data: { hourly: HourlyWeatherData}) => {
      this.hourlyWeatherData = this.weatherDataService.mapHourlyWeatherData(data.hourly, this.hours);
    });
    this.activeIndexSub = this.weatherDataService.activeIndex$.subscribe((index: number) => this.activeIndex = index)
  }

  ngOnDestroy(): void {
    if(this.hourlyDataSub) this.hourlyDataSub.unsubscribe();
  }
  
}
