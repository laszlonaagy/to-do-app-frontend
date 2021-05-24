import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomValidators } from 'src/app/custom-validators';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public updateUserForm: FormGroup;
  public failedUpdate = false;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private http: HttpClient,
  private dialogRef: MatDialogRef<EditComponent>) {
  this.updateUserForm = this.createUpdateUserForm();
  }

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  ngOnInit(): void {
  }

  createUpdateUserForm(): FormGroup {
    // tslint:disable-next-line: deprecation
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

  submit(user) {
    if (this.updateUserForm.valid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      this.http.put(environment.api_url + '/users/' + user.id, this.updateUserForm.value).subscribe(response => {
        localStorage['user'] = response;
        this.closeDialog();
      }, err => {
        this.failedUpdate = true;
        console.log(err);
      });
    }

  }

  closeDialog(){
    this.dialogRef.close(true);
  }

}
