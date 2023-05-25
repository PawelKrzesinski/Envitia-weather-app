import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { WeatherData, TransformedWeatherDataByDay, TransformedWeatherDataByHour } from '../weather.model';
@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  responsiveOptions = [
    {
        breakpoint: '1564px',
        numVisible: 6,
        numScroll: 3
    },
    {
        breakpoint: '1200px',
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

  constructor(private http: HttpClient){}

  getAPIData(lon: string, lat: string): Observable<any>{
    return this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weathercode,temperature_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall,surface_pressure,visibility,windspeed_10m,winddirection_10m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&current_weather=true&forecast_days=5`);
  }

  mapApiDataToObject(data: WeatherData, days: TransformedWeatherDataByDay[], hours: string[]): TransformedWeatherDataByDay[] {
    const modifiedDates = this.handleDates(data.daily.time);
    const modifiedSunsetTime = this.handleTimes(data.daily.sunset)    
    const modifiedSunriseTime = this.handleTimes(data.daily.sunrise)  
    const hourlyData = JSON.parse(JSON.stringify(data.hourly)); //Creates a deep copy of the original array to prevent mutating it.
    console.log('CHECKING DATA1 :', data)
    const readyData = days.map((day, index) => {
      if(day.current_temp) day.current_temp = data.current_weather.temperature;
      return day = {
        sunset: modifiedSunsetTime[index],
        sunrise: modifiedSunriseTime[index],
        time: modifiedDates[index],
        temperature_2m_max: data.daily.temperature_2m_max[index],
        temperature_2m_min: data.daily.temperature_2m_min[index],
        weathercode: data.daily.weathercode[index],
        hourly: {
          time: hourlyData.time.splice(0, hours.length),
          temperature_2m: hourlyData.temperature_2m.splice(0, hours.length),
          apparent_temperature: hourlyData.apparent_temperature.splice(0, hours.length),
          precipitation_probability: hourlyData.precipitation_probability.splice(0, hours.length),
          rain: hourlyData.rain.splice(0, hours.length),
          showers: hourlyData.showers.splice(0, hours.length),
          snowfall: hourlyData.snowfall.splice(0, hours.length),
          surface_pressure: hourlyData.surface_pressure.splice(0, hours.length),
          visibility: hourlyData.visibility.splice(0, hours.length),
          windspeed_10m: hourlyData.windspeed_10m.splice(0, hours.length),
          winddirection_10m: hourlyData.winddirection_10m.splice(0, hours.length),
          is_day: hourlyData.is_day.splice(0, hours.length),
          weathercode: hourlyData.weathercode.splice(0, hours.length)
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
  getSelectedDayData(day: TransformedWeatherDataByDay, hour: string, hours: string[]): TransformedWeatherDataByHour {
    const index = hours.indexOf(hour);
    return {
      feelsLike: Math.round(day.hourly.apparent_temperature[index]),
      temp: Math.round(day.hourly.temperature_2m[index]),
      precipitation: day.hourly.precipitation_probability[index],
      pressure: Math.round(day.hourly.surface_pressure[index]),
      windspeed: Math.round(day.hourly.windspeed_10m[index]),
      winddirection: day.hourly.winddirection_10m[index],
      visibility: day.hourly.visibility[index],
      is_day: day.hourly.is_day[index],
      rain: day.hourly.rain[index],
      showers: day.hourly.showers[index],
      snowfall: day.hourly.snowfall[index],
    }
  }

  getWeatherIcons(code: number) {
    switch (code) {
      case 0:
        return 'https://openweathermap.org/img/wn/01d@2x.png';
      case 1:
        return 'https://openweathermap.org/img/wn/02d@2x.png';
      case 2:
        return 'https://openweathermap.org/img/wn/03d@2x.png';
      case 3:
        return 'https://openweathermap.org/img/wn/04d@2x.png';
      case 45:
      case 48:
        return 'https://openweathermap.org/img/wn/50d@2x.png';
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return 'https://openweathermap.org/img/wn/09d@2x.png';
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
        return 'https://openweathermap.org/img/wn/10d@2x.png';
      case 71:
      case 73:
      case 75:
      case 77:
        return 'https://openweathermap.org/img/wn/13d@2x.png';
      case 80:
      case 81:
      case 82:
      case 85:
      case 86:
        return 'https://openweathermap.org/img/wn/09d@2x.png';
      case 95:
      case 96:
      case 99:
        return 'https://openweathermap.org/img/wn/11d@2x.png';
      default:
        return '';
    }
  }
}
