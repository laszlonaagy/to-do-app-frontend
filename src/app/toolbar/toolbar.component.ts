import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../usertable/add/add.component';
import { AuthenticationService } from '../../Services/authentication.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public loggedIn = localStorage['loggedIn'];
  public profile_name = JSON.parse(localStorage['user']).name;
  constructor(public dialog: MatDialog, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.AuthEvent
    .subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });

    if (this.loggedIn) {
    }
  }

  showAddUserModal() {
    const dialogRef = this.dialog.open(AddComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
