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

  getConfig(): Observable<Config> {
    return this.http.get<Config>(`${this.configUrl}/get`);
  }

  saveConfig(config: Config): Observable<void> {
    return this.http.post<void>(`${this.configUrl}/save`, config);
  }

  getFirebirdConfig(): Observable<{ firebirdConfigs: { ip: string; alias: string; }[]; backupFolders: string[]; }> {
    return this.http.get<{ firebirdConfigs: { ip: string; alias: string; }[]; backupFolders: string[]; }>(`${this.configUrl}/firebird`);
  }
}