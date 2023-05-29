import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCurrentlyComponent } from './weather-currently.component';

describe('WeatherCurrentlyComponent', () => {
  let component: WeatherCurrentlyComponent;
  let fixture: ComponentFixture<WeatherCurrentlyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherCurrentlyComponent]
    });
    fixture = TestBed.createComponent(WeatherCurrentlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
