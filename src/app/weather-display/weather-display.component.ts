import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WeatherDataService } from '../services/weather-data.service';
import { ResponsiveSettings } from './weather.model';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WeatherDisplayComponent implements OnInit {
  responsiveOptions: ResponsiveSettings[] = []; 

  hours: string[] = []

  constructor(private weatherDataService: WeatherDataService){
    this.hours = this.weatherDataService.hours;
  };

  ngOnInit(): void { 
    this.responsiveOptions = this.weatherDataService.responsiveOptions;
  };

}
