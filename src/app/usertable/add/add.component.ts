import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomValidators } from 'src/app/custom-validators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public addForm: FormGroup;
  public failedAdd = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private dialogRef: MatDialogRef<AddComponent>) {
    this.addForm = this.addUserForm();
   }

  ngOnInit(): void {
  }

  addUserForm(): FormGroup {
    return this.fb.group(
      {
        name: [null,
          Validators.compose([Validators.required])],
        email: [
          null,
          Validators.compose([Validators.email, Validators.required, CustomValidators.patternValidator(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, {
            isValidEmail: true
          })])
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(8)
          ])
        ],
        password_confirmation: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  submit() {
    if (this.addForm.valid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      this.http.post(environment.api_url + '/users', this.addForm.value, {headers:headers}).subscribe(response => {
        this.closeDialog();
      }, err => {
        this.failedAdd = true;
        console.log(err);
      });
    }

  }

  closeDialog(){
    this.dialogRef.close(true);
  }


}
