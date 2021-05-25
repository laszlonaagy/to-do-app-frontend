import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomValidators } from 'src/app/custom-validators';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { UploadService } from 'src/Services/upload.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  public updateUserForm: FormGroup;
  public failedUpdate = false;
  file: File | null = null;
  private subscription: Subscription | undefined;
  public filename;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private http: HttpClient,
  private dialogRef: MatDialogRef<EditComponent>,
  private uploads: UploadService,
  private sanitizer: DomSanitizer) {
  this.updateUserForm = this.createUpdateUserForm();
  }

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  ngOnInit() {
    console.log('data',this.data);

    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    this.http.get(environment.api_url + '/user-image-download/' + this.data.image_path, { headers : headers , responseType: 'blob'}).subscribe(response => {
      let unsafeImageUrl = URL.createObjectURL(response);
      let imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        this.filename = imageUrl;
    }, err => {
      console.log(err);
    });

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  createUpdateUserForm(): FormGroup {
    // tslint:disable-next-line: deprecation
    return this.fb.group(
      {
        name: [this.data.name,
          Validators.compose([Validators.required])],
        email: [this.data.email,
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

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
    }
  }

  submit() {
    if (this.updateUserForm.valid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      this.http.put(environment.api_url + '/users/' + this.data.id, this.updateUserForm.value, { headers : headers}).subscribe(response => {
        this.closeDialog();
        this.subscription = this.uploads.upload(this.file, this.data.id).subscribe();
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
