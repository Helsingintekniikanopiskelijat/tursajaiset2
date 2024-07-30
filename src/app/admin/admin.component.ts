import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', './admin-styles.css']
})
export class AdminComponent implements OnInit {

  loaded: boolean = false
  user: null | undefined
  allowedToEdit?: boolean

  constructor(
    public auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user
      this.auth.updateUserRecord(user).then(success => this.allowedToEdit = success)
      this.loaded = true
    })

  }
}