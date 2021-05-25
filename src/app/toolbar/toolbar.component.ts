import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../usertable/add/add.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showAddUserModal() {
    const dialogRef = this.dialog.open(AddComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
