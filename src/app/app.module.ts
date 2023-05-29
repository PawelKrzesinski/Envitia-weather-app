import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { AppComponent } from './app.component';
import { WeatherDisplayComponent } from './weather-display/weather-display.component';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule } from 'primeng/tabmenu';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { AvatarModule } from 'primeng/avatar';
import { WeatherDailyComponent } from './weather-daily/weather-daily.component';
import { WeatherHourlyComponent } from './weather-hourly/weather-hourly.component';
import { WeatherCurrentlyComponent } from './weather-currently/weather-currently.component';




@NgModule({
  declarations: [
    AppComponent,
    WeatherDisplayComponent,
    WeatherDailyComponent,
    WeatherHourlyComponent,
    WeatherCurrentlyComponent,
  ],
  imports: [
    RouterModule.forRoot([]),
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    HttpClientModule,
    TabViewModule,
    CardModule,
    InputTextModule,
    FormsModule,
    FieldsetModule,
    ReactiveFormsModule,
    TabMenuModule,
    CarouselModule,
    AvatarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
