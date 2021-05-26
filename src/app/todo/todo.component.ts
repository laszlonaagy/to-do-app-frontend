import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { EditTodoComponent } from '../todo/edit-todo/edit-todo.component';
import { NewTodoComponent } from './new-todo/new-todo.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  constructor(private http: HttpClient,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: ChangeDetectorRef) { }

  public displayedColumns: string[] = ['id', 'title', 'description', 'deadline', 'priority_value', 'edit_todo', 'delete_todo', 'attachment'];
  public dataSource;
  public emptyTodo = false;

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.get(environment.api_url + '/userTodos/' + this.data.id, { headers: headers }).subscribe(response => {
      if(Object.keys(response).length) {
        this.dataSource = response;
        this.emptyTodo = true;
        this.ref.detectChanges();
      }
    }, err => {
      this.emptyTodo = false;
      console.log(err);
    });
    
  }

  deleteTodo(todo) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.delete(environment.api_url + '/todos/' + todo.id,{ headers: headers }).subscribe(response => {
      this.listTodos();
    }, err => {
      console.log(err);
    });
  }

  editTodo(todo) {
    const dialogRef = this.dialog.open(EditTodoComponent, {
      data: {todo: todo, user:this.data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listTodos();
    });
  }

  addTodo() {
    const dialogRef = this.dialog.open(NewTodoComponent, {
      data: this.data 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listTodos();
    });
  }

}
