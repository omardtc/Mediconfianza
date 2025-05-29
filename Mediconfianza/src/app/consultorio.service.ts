import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {

  private apiKey: string = 'a';

  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  generateIdea(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un medico que va a dar recomendaciones y responder preguntas sobre la salud de alguien, pero no reemplazarás a un doctor humano.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.7
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        console.log('Respuesta de OpenAI:', response);
        if (response && response.choices && response.choices[0].message) {
          return response.choices[0].message.content.trim();
        } else {
          return 'La respuesta no tiene el formato esperado.';
        }
      }),
      catchError(error => {
        console.error('Error al generar la idea:', error);
        return throwError(() => new Error('Hubo un error generando la idea. Intenta nuevamente.'));
      })
    );
  }
}
