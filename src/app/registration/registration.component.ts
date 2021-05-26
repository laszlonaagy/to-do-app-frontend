import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../custom-validators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public signUpForm: FormGroup;
  public failedReg = false;

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private fb: FormBuilder, private http: HttpClient, private dialogRef: MatDialogRef<RegistrationComponent>) {
    this.signUpForm = this.createSignupForm();
  }

  ngOnInit(): void {
  }

  createSignupForm(): FormGroup {
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

  submit() {
    if (this.signUpForm.valid) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      this.http.post(environment.api_url + '/register', this.signUpForm.value).subscribe(response => {
        this.closeDialog();
      }, err => {
        this.failedReg = true;
        console.log(err);
      });
    }

  }

  closeDialog(){
    this.dialogRef.close(true);
  }

}
