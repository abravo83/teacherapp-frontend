import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpContactarComponent } from './pop-up-contactar.component';

describe('PopUpContactarComponent', () => {
  let component: PopUpContactarComponent;
  let fixture: ComponentFixture<PopUpContactarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpContactarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpContactarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
