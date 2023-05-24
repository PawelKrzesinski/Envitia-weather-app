import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { AppComponent } from './app.component';
import { WeatherDisplayComponent } from './weather-display/weather-display.component';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    AppComponent,
    WeatherDisplayComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    HttpClientModule,
    TabViewModule,
    CardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
