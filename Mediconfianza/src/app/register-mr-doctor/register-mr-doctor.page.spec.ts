import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterMrDoctorPage } from './register-mr-doctor.page';

describe('RegisterMrDoctorPage', () => {
  let component: RegisterMrDoctorPage;
  let fixture: ComponentFixture<RegisterMrDoctorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMrDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
