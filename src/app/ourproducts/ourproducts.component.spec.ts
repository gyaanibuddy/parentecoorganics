import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurproductsComponent } from './ourproducts.component';

describe('OurproductsComponent', () => {
  let component: OurproductsComponent;
  let fixture: ComponentFixture<OurproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurproductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
