import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../../Services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from './edit/edit.component';
import { Observable } from 'rxjs';
import { TodoComponent } from '../todo/todo.component';

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

    if (this.loggedIn) {
      this.listUser();
    }
  }

  listUser() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.get(environment.api_url + '/users',{ headers: headers }).subscribe(response => {
      this.dataSource = response;
    }, err => {
      console.log(err);
    });
  }

  deleteUser(user) {
    event.stopPropagation();
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
    event.stopPropagation();
    const dialogRef = this.dialog.open(EditComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listUser();
    });
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  showTodos(row) {
    const dialogRef = this.dialog.open(TodoComponent, {
      data: row,
      autoFocus: false,
      maxHeight: '90vh',
      minWidth: '90vh'  

    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
