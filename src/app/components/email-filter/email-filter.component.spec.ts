import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFilterComponent } from './email-filter.component';

describe('EmailFilterComponent', () => {
  let component: EmailFilterComponent;
  let fixture: ComponentFixture<EmailFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
