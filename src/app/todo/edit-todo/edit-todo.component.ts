import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {

  constructor(private http: HttpClient,
    private dialogRef: MatDialogRef<EditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    public failedAddTodo = false;
    public priorities;
    
      public addForm = new FormGroup({
    title: new FormControl(this.data.todo.title, Validators.required),
    description: new FormControl(this.data.todo.description),
    deadline: new FormControl(this.data.todo.deadline, Validators.required),
    priority_value: new FormControl(this.data.todo.priority_value, Validators.required)
     });
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
      this.addForm.value.user_id = this.data.user.id;
      if (this.addForm.valid) {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        this.http.put(environment.api_url + '/todos/' + this.data.todo.id, this.addForm.value, { headers: headers }).subscribe(response => {
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
