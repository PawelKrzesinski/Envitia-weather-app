import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CurrentWeatherDataByHour, DailyWeatherData, DailyWeatherDataWithTimezone, HourlyWeatherData } from '../weather-display/weather.model';
import * as DataHandling from '../helpers/data-handling.helper';
@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private dailyDataSubject: BehaviorSubject<DailyWeatherDataWithTimezone> = new BehaviorSubject<DailyWeatherDataWithTimezone>({} as DailyWeatherDataWithTimezone);
  public dailyData$: Observable<DailyWeatherDataWithTimezone> = this.dailyDataSubject.asObservable();

  private hourlyDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public hourlyData$: Observable<{ hourly: HourlyWeatherData}> = this.hourlyDataSubject.asObservable();

  private activeIndex = new BehaviorSubject<number>(0);
  activeIndex$ = this.activeIndex.asObservable();

  responsiveOptions = [
    {
        breakpoint: '1564px',
        numVisible: 4,
        numScroll: 4
    },
    {
        breakpoint: '1300px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '900px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1,
    }
  ];
  hours: string[] = [
    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00',
    '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
  ];
  constructor(private http: HttpClient){}

  getDailyData(lon: string, lat: string): Observable<DailyWeatherDataWithTimezone>{
    return this.http.get<DailyWeatherDataWithTimezone>(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=rain_sum,windspeed_10m_max,winddirection_10m_dominant,weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=5&timezone=auto`)
        .pipe(
          tap((response: DailyWeatherDataWithTimezone) => {
            this.dailyDataSubject.next(response);
          })
        )
  }

  getHourlyData(lon: string, lat: string): void{
     this.http.get<HourlyWeatherData[]>(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weathercode,temperature_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall,surface_pressure,visibility,windspeed_10m,winddirection_10m,is_day&forecast_days=5`)
      .pipe(
        tap((response: HourlyWeatherData[]) => {
          this.hourlyDataSubject.next(response);
        })
      ).subscribe()
  }

  mapDailyWeatherData(data: DailyWeatherData): DailyWeatherData{
    const splitDates = DataHandling.changeDateFormat(data.time)
    const splitSunrises = DataHandling.splitTimeFromDate(data.sunrise);
    const splitSunsets = DataHandling.splitTimeFromDate(data.sunset);
    const minTempRounded = DataHandling.roundTheNumbers(data.temperature_2m_min);
    const maxTempRounded = DataHandling.roundTheNumbers(data.temperature_2m_max);
    const maxWindSpeed = DataHandling.roundTheNumbers(data.windspeed_10m_max);
    return {
        sunrise: splitSunrises,
        sunset: splitSunsets,
        temperature_2m_max: maxTempRounded,
        temperature_2m_min: minTempRounded,
        time: splitDates,
        weathercode: data.weathercode,
       windspeed_10m_max: maxWindSpeed,
       winddirection_10m_dominant: data.winddirection_10m_dominant ,
       rain_sum: data.rain_sum,
    }
  }

  mapHourlyWeatherData(data: HourlyWeatherData, hours: string[]): HourlyWeatherData[] {
    const day: HourlyWeatherData = {} as HourlyWeatherData;
    const days: HourlyWeatherData[] = [day, day, day, day, day];
    const hourlyData = JSON.parse(JSON.stringify(data)); //Creates a deep copy of the original array to prevent mutating it.
    const roundedTemperature = DataHandling.roundTheNumbers(hourlyData.temperature_2m)
    const roundedFeelsLike = DataHandling.roundTheNumbers(hourlyData.apparent_temperature ) 
    const roundedPressure = DataHandling.roundTheNumbers(hourlyData.surface_pressure) 
    const roundedWindSpeed = DataHandling.roundTheNumbers(hourlyData.windspeed_10m)
    return days.map((item) => {
      return item = {
        time: hourlyData.time.splice(0, hours.length),
        temperature_2m: roundedTemperature.splice(0, hours.length),
        apparent_temperature: roundedFeelsLike.splice(0, hours.length),
        precipitation_probability: hourlyData.precipitation_probability.splice(0, hours.length),
        rain: hourlyData.rain.splice(0, hours.length),
        showers: hourlyData.showers.splice(0, hours.length),
        snowfall: hourlyData.snowfall.splice(0, hours.length),
        surface_pressure: roundedPressure.splice(0, hours.length),
        visibility: hourlyData.visibility.splice(0, hours.length),
        windspeed_10m: roundedWindSpeed.splice(0, hours.length),
        winddirection_10m: hourlyData.winddirection_10m.splice(0, hours.length),
        is_day: hourlyData.is_day.splice(0, hours.length),
        weathercode: hourlyData.weathercode.splice(0, hours.length)
      }
    })
  }

  extractDataByHour(day: HourlyWeatherData, hour: string, hours: string[]): CurrentWeatherDataByHour {
    const index = hours.indexOf(hour);
    return {
      feels_like: Math.round(day.apparent_temperature[index]),
      temp: Math.round(day.temperature_2m[index]),
      precipitation: day.precipitation_probability[index],
      pressure: Math.round(day.surface_pressure[index]),
      windspeed: Math.round(day.windspeed_10m[index]),
      wind_direction: day.winddirection_10m[index],
      visibility: day.visibility[index],
      is_day: day.is_day[index],
      rain: day.rain[index],
      showers: day.showers[index],
      snowfall: day.snowfall[index],
    }
  }

  getCurrentTime(): string{
    const date = new Date()
    let hour = date.getHours().toString();
    return `${hour.length === 1 ? '0' : '' }${hour}:00`;
  }

  changeTab(index: number) {
    this.activeIndex.next(index);
  }

  getWeatherIcons(code: number): string {
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
