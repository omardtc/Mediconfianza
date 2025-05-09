import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  // calendar.service.ts
getDiasDeSemana(anio: number, semana: number): Date[] {
  const simple = new Date(anio, 0, 1); // 1 de enero
  const dayOfWeek = simple.getDay(); // 0=domingo, 1=lunes, etc.

  const primerLunes = new Date(simple);
  const diff = (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek);
  primerLunes.setDate(simple.getDate() + diff);

  const diasSemana: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(primerLunes);
    date.setDate(primerLunes.getDate() + (semana - 1) * 7 + i);
    diasSemana.push(date);
  }

  return diasSemana;
}
}
