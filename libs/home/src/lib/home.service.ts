import { ApiService } from '@realworld/core/http-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private apiService: ApiService) {}

  getTags(): Observable<{ tags: string[] }> {
    return this.apiService.get('/tags');
  }

  setTags(tag: string): Observable<{ tag: string }> {
    console.log(tag);
    return this.apiService.post<{ tag: string }, { tag: string }>('/tags', { tag });
  }
}
