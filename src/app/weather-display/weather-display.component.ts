import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherDataService } from './services/weather-data.service';
import { Subscription } from 'rxjs';
import { WeatherData, WeatherDataPerDay } from './weather.model';

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
  day: WeatherDataPerDay = {
    sunrise: '',
    sunset: '',
    time: '',
    temperature_2m_max: 1,
    temperature_2m_min: 1,
    hourly: {
      temperature_2m: [],
      apparent_temperature: [],
      is_day: [],
      precipitation_probability: [],
      rain: [],
      surface_pressure: [],
      windspeed_10m: [],
      winddirection_10m: [],
      time: [],
      showers: [],
      snowfall: [],
      visibility: [],
    }
  }
  days: WeatherDataPerDay[] = [this.day, this.day, this.day, this.day, this.day];
  selectedDay = this.days[0];
  activeIndex: number = 0;
  locationForm: FormGroup;
  subscription: Subscription | undefined;
  constructor(private weatherDataService: WeatherDataService){
    this.locationForm = new FormGroup({
      lon: new FormControl('', [Validators.required, Validators.pattern(/[+-]?([0-9]*[.])?[0-9]+/)]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/[+-]?([0-9]*[.])?[0-9]+/)])
    });
  }
  ngOnInit(): void {
    this.subscription = this.weatherDataService.getAPIData('-3.53', '50.72').subscribe((data: WeatherData) => {
      console.log('DATA: ', data)
      this.days = this.mapApiDataToObject(data);
      this.selectedDay = this.days[0];
      this.days[0].current_temp = data.current_weather.temperature;
      this.timezone = data.timezone;
    });
    this.responsiveOptions = [
      {
          breakpoint: '991px',
          numVisible: 4,
          numScroll: 4
      },
      {
          breakpoint: '769px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '480px',
          numVisible: 1,
          numScroll: 1,
      }
    ];
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
      this.subscription = this.weatherDataService.getAPIData(formData.lon.toString(), formData.lat.toString()).subscribe((data) => {
        if (data) {
          this.mapApiDataToObject(data);
        }
      })
    } else {
      // Handle form validation errors
    }
  }
  dayChangeHandler(event: any){
    this.selectedDay = this.days[event.index];
  }
  
  getFeelsLike(day: WeatherDataPerDay, hour: string): number {
    const index = this.hours.indexOf(hour);
    return Math.round(day.hourly.apparent_temperature[index]);
  }

  mapApiDataToObject(data: WeatherData): WeatherDataPerDay[] {
    const modifiedDates = this.handleDates(data.daily.time);
    const modifiedSunsetTime = this.handleTimes(data.daily.sunset)    
    const modifiedSunriseTime = this.handleTimes(data.daily.sunrise)  
    const hourlyData = data.hourly;
    const readyData = this.days.map((day, index) => {
      if(day.current_temp) day.current_temp = data.current_weather.temperature;
      return day = {
        sunset: modifiedSunsetTime[index],
        sunrise: modifiedSunriseTime[index],
        time: modifiedDates[index],
        temperature_2m_max: data.daily.temperature_2m_max[index],
        temperature_2m_min: data.daily.temperature_2m_min[index],
        hourly: {
          time: hourlyData.time.splice(0, this.hours.length),
          temperature_2m: hourlyData.temperature_2m.splice(0, this.hours.length),
          apparent_temperature: hourlyData.apparent_temperature.splice(0, this.hours.length),
          precipitation_probability: hourlyData.precipitation_probability.splice(0, this.hours.length),
          rain: hourlyData.rain.splice(0, this.hours.length),
          showers: hourlyData.showers.splice(0, this.hours.length),
          snowfall: hourlyData.snowfall.splice(0, this.hours.length),
          surface_pressure: hourlyData.surface_pressure.splice(0, this.hours.length),
          visibility: hourlyData.visibility.splice(0, this.hours.length),
          windspeed_10m: hourlyData.windspeed_10m.splice(0, this.hours.length),
          winddirection_10m: hourlyData.winddirection_10m.splice(0, this.hours.length),
          is_day: hourlyData.is_day.splice(0, this.hours.length),
        }
      }
    })
    return readyData;
  }

  handleDates(data: string[]): string[] {
    return data.map((date) => {
      const newDate = date.split('-');
      return `${newDate[2]}/${newDate[1]}`
    });
  }
  handleTimes(data: string[]): string[] { 
    return data.map((date) => date.split('T')[1]);
  }
}
