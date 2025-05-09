import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HacercitaPage } from './hacercita.page';

describe('HacercitaPage', () => {
  let component: HacercitaPage;
  let fixture: ComponentFixture<HacercitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HacercitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
