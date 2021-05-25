import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../login/login.component';
import { RegistrationComponent } from '../../registration/registration.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../../Services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public dialog: MatDialog, private ref: ChangeDetectorRef, private http: HttpClient, private auth: AuthenticationService ) { }

  public loggedIn = localStorage['loggedIn'];

  ngOnInit(): void {

  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loggedIn = true;
        this.ref.detectChanges();
        this.auth.authNotification(this.loggedIn);
      }
    });
  }

  openRegistrationDialog() {
    const dialogRef = this.dialog.open(RegistrationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.openLoginDialog();
      }
    });
  }

  logOut() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.post(environment.api_url + '/logout', '',{ headers: headers }).subscribe(response => {
      localStorage.clear();
      this.loggedIn = false;
      this.ref.detectChanges();
      this.auth.authNotification(this.loggedIn);
    }, err => {
      console.log(err);
    });
  }

}
