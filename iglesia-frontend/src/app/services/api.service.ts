import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  getMinistries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ministries`);
  }

  submitContact(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contact`, formData);
  }
}
