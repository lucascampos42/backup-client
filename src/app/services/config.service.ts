import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Config {
  gbak_path: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'http://localhost:1420/config';

  constructor(private http: HttpClient) {}

}