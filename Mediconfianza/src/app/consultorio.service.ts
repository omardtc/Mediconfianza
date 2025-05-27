import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = '';

  constructor(private http: HttpClient) { }

  diagnosticoExpress(sintomas: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un médico virtual que da recomendaciones básicas de salud, pero no reemplazas una consulta médica profesional.' },
        { role: 'user', content: `Tengo los siguientes síntomas: ${sintomas}. ¿Qué podría tener y qué me recomiendas hacer?` }
      ],
      temperature: 0.7
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
