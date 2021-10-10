import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelieverHistoryComponent } from './deliever-history.component';

describe('DelieverHistoryComponent', () => {
  let component: DelieverHistoryComponent;
  let fixture: ComponentFixture<DelieverHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelieverHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelieverHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
