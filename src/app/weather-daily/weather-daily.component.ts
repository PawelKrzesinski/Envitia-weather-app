import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, map, tap } from 'rxjs';
import { WeatherDataService } from '../services/weather-data.service';
import { DailyWeatherData, DailyWeatherDataWithTimezone, HourlyWeatherData } from '../weather-display/weather.model';
import * as DataHandling from '../helpers/data-handling.helper';
@Component({
  selector: 'app-weather-daily',
  templateUrl: './weather-daily.component.html',
  styleUrls: ['./weather-daily.component.css']
})
export class WeatherDailyComponent implements OnInit {
  timezone: string = '';
  dailyWeatherData$: Observable<DailyWeatherData> | undefined;
  dates: string[] = [];
  selectedDay: number = 0;
  activeIndex: number = 0;
  locationForm: FormGroup;
  weatherCodes: number[] = [];
  subscription: Subscription | undefined;
  days: number[] = [0, 1, 2, 3, 4]
  constructor(private weatherDataService: WeatherDataService){
    this.locationForm = new FormGroup({
      lon: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|1[0-7]\d)(\.\d{1,2})?|180(\.0{1,2})?)$/)]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^-?((\d{1,2}|[1-8]\d)(\.\d{1,2})?|90(\.0{1,2})?)$/)])
    });
  }

  ngOnInit(): void {
    // napisac loopa do days.push() bazuje na .length daty
    
    this.dailyWeatherData$ = this.weatherDataService.getDailyData('-3.53', '50.72').pipe(
      map((data: DailyWeatherDataWithTimezone) => {
        console.log(data)
        this.timezone = data.timezone;
        this.dates = DataHandling.changeDateFormat(data.daily.time);
        if(this.dates[0]) this.dates[0] = this.dates[0] +"(Today)";
        this.weatherCodes = data.daily.weathercode;
        return this.weatherDataService.mapDailyWeatherData(data.daily)
      },
    ));
    
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
      // this.hourlyWeatherData$ = this.weatherDataService.getHourlyData(formData.lon.toString(), formData.lat.toString()).pipe(
      //   map((data: { hourly: HourlyWeatherData }) => {
      //     return this.weatherDataService.mapHourlyWeatherData(data.hourly, this.weatherDataService.hours);
      //   }),
      //   tap((hourlyWeatherData: HourlyWeatherData[]) => {

      //       );
      //   })
      //);
    }
  }

  dayChangeHandler(event: any): void{
    this.selectedDay = event.index;
    this.activeIndex = event.index;
  }
  fetchData(lon: string, lat: string){
    
    this.weatherDataService.getHourlyData(lon, lat).subscribe();
  }
  
  fetchWeatherIcon(code: number): string{
    return this.weatherDataService.getWeatherIcons(code)
  }
}

