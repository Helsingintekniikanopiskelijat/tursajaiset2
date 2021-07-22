import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingFormComponent } from './mailing-form.component';

describe('MailingFormComponent', () => {
  let component: MailingFormComponent;
  let fixture: ComponentFixture<MailingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
