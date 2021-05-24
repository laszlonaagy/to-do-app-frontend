import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../../Services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {

  constructor(private http: HttpClient, private auth: AuthenticationService, public dialog: MatDialog) { }

  public loggedIn = localStorage['loggedIn'];
  public displayedColumns: string[] = ['id', 'name', 'email', 'created_at', 'edit_user', 'delete_user'];
  public dataSource; 

  ngOnInit(): void {

    this.auth.AuthEvent
    .subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
      this.listUser();
    });
    this.listUser();

  }

  listUser() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.get(environment.api_url + '/users',{ headers: headers }).subscribe(response => {
      console.log(response);
      this.dataSource = response;
    }, err => {
      console.log(err);
    });
  }

  deleteUser(user) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.delete(environment.api_url + '/users/' + user.id,{ headers: headers }).subscribe(response => {
      this.listUser();
    }, err => {
      console.log(err);
    });
  }

  editUser(user) {
    const dialogRef = this.dialog.open(EditComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        
      }
    });
  }

}
