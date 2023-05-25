export type WeatherData = {
  current_weather: CurrentDay,
  daily: {
    time: string[],
    sunrise: string[],
    sunset: string[],
    temperature_2m_max: number[],
    temperature_2m_min: number[],
  },
  hourly: WeatherHourly,
  latitude: number,
  longitude: number,
  timezone: string,
}

export type WeatherDaily = {
  time: string,
  sunrise: string,
  sunset: string,
  temperature_2m_max: number,
  temperature_2m_min: number,
  current_temp?: number,
}

export type CurrentDay = {
  is_day: number,
  temperature: number,
  time: string,
  winddirection: number,
  windspeed: number,
}

export type WeatherHourly = {
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
}

export type WeatherDataPerDay = WeatherDaily & {
  hourly: WeatherHourly
};

export type CurrentWeatherData = {
  
}