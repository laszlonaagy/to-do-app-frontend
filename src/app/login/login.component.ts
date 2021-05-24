import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),
  });
  public failedLogin = false;

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private http: HttpClient, private dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
    console.log(localStorage);
  }

  submit() {
    if (this.form.valid) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      this.http.post(environment.api_url + '/login', this.form.value).subscribe(response => {
        let token = Object.entries(response['data']);
        localStorage['loggedIn'] = true;
        localStorage['token'] = token[0][1];
        localStorage['acces_type'] = token[1][1];
        localStorage['expires_in'] = token[2][1];
        console.log(token);
        this.closeDialog();
        console.log(localStorage);
      }, err => {
        this.failedLogin = true;
        console.log(err);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(true);
  }


}
