import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  upload(file: File, id): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('id', id);

    return this.http.post(environment.api_url + '/user-image-upload', data);
  }
}