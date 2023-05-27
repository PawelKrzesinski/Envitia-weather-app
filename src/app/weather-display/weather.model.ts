
export type CurrentWeatherData = {
  current_weather: {
    is_day: number,
    temperature: number,
    time: string,
    winddirection: number,
    windspeed: number,
    weathercode: number,
  }
}
export type MappedCurrentWeatherData = {
  is_day: number,
  temperature: number,
  time: string,
  winddirection: number,
  windspeed: number,
  weathercode: number,
  timezone: string,
}

export type DailyWeatherData = {
  time: string[],
  sunrise: string[],
  sunset: string[],
  temperature_2m_max: number[],
  temperature_2m_min: number[],
  weathercode: number[],
}

export type HourlyWeatherData = {
  time: string[],
  temperature_2m: number[],
  apparent_temperature: number[],
  precipitation_probability: number[],
  rain: number[],
  showers: number[],
  snowfall: number[],
  surface_pressure: number[],
  visibility: number[],
  windspeed_10m: number[],
  winddirection_10m: number[],
  is_day: number[],
  weathercode: number[],
}

export type CurrentWeatherDataByHour = {
  feels_like: number,
  temp: number,
  precipitation: number,
  pressure: number,
  windspeed: number,
  wind_direction: number,
  visibility: number,
  is_day: number,
  rain: number,
  showers: number,
  snowfall: number,
}

export type ResponsiveSettings = {
  breakpoint: string,
  numVisible: number,
  numScroll: number,
}