import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDelieverComponent } from './admin-deliever.component';

describe('AdminDelieverComponent', () => {
  let component: AdminDelieverComponent;
  let fixture: ComponentFixture<AdminDelieverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDelieverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDelieverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
