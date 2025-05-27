import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultorioPage } from './consultorio.page';

describe('ConsultorioPage', () => {
  let component: ConsultorioPage;
  let fixture: ComponentFixture<ConsultorioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultorioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
