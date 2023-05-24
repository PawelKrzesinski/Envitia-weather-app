export type WeatherDaily = {
  current_temp: number,
  is_day: 0 | 1,
  time: string,
  wind_dir: number,
  wind_spd: number,
  sunrise: string[],
  sunset: string[],
  min_max_temp: Temperatures,
  date: string[],
  timezone: string,
}

type Temperatures = {
  lowest: number[],
  highest: number[]
}

export type WeatherHourly = {
  temperature: number[],
  feel_like_temp: number[],
  is_day: number[],
  precipitation: number[]
  rain: number[],
  pressure: number[],
  wind_dir: number[],
  wind_spd: number[],
}
