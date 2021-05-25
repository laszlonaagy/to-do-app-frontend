import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) { }
  title = 'To Do Application';

  ngOnInit() {
    if (localStorage['token'] !== '') {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      this.http.get(environment.api_url + '/me',{ headers: headers }).subscribe(response => {
        localStorage['loggedIn'] = true;
      }, err => {
        localStorage.clear();
      });

    } else {
      localStorage['loggedIn'] = false;
    }

  }
}
