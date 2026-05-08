import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:8080/api/v1/entities/persona';

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  savePersona(persona: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, persona);
  }
}
