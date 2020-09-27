import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IPService {

  constructor(
    private http: HttpClient
  ) { }

  getIPAddress() {
    return this.http.get('http://api.ipify.org/?format=json').toPromise();
  }
}
