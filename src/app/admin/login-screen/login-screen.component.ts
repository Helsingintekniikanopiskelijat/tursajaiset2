import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['../admin-styles-2.css','./login-screen.component.css', '../admin-styles.css']
})
export class LoginScreenComponent implements OnInit {

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

}
