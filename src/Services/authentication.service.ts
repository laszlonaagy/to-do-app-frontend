import { Injectable, EventEmitter, Output } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @Output() AuthEvent = new EventEmitter<boolean>();

  authNotification(loggedIn) {
    this.AuthEvent.emit(loggedIn);
  }



}
