import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.css']
})
export class NewTodoComponent implements OnInit {

  constructor( private http: HttpClient, 
    private dialogRef: MatDialogRef<NewTodoComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  public addForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    deadline: new FormControl('', Validators.required),
    priority_value: new FormControl('', Validators.required)
  });
  public failedAddTodo = false;
  public priorities;

  ngOnInit(): void {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.get(environment.api_url + '/priorities', { headers: headers }).subscribe(response => {
      this.priorities = response;
    }, err => {
      this.failedAddTodo = true;
      console.log(err);
    });
  }

  submit() {
    this.addForm.value.user_id = this.data.id;
    if (this.addForm.valid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      this.http.post(environment.api_url + '/todos', this.addForm.value, { headers: headers }).subscribe(response => {
        this.closeDialog();
      }, err => {
        this.failedAddTodo = true;
        console.log(err);
      });
    }

  }

  closeDialog() {
    this.dialogRef.close(true);
  }
}
