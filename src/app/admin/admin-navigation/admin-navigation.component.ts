import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['../admin-styles.css', './admin-navigation.component.css']
})
export class AdminNavigationComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.changeSize(false)
  }

  changeSize(open: boolean) {
    let elements = document.querySelectorAll(".admin-navigation-icon") as any
    let titleElements = document.querySelectorAll(".navigation-title") as any
    let mainNavigation = document.querySelector(".admin-main-navigation") as any
    if (open) {
      mainNavigation.style.height = 'clamp(70px, 10vh, 90px)'
    }
    else {
      mainNavigation.style.height = 'clamp(40px, 6vh, 50px)'
    }
    elements.forEach((element: {style: any;}) => {
      if (open) {
        element.style.maxHeight = "40px"
      }
      else {
        element.style.maxHeight = "30px"
      }
    })
    titleElements.forEach((element: {style: any;}) => {
      if (open) {
        element.style.fontSize = "clamp(17px, 2vh, 22px)"
      }
      else {
        element.style.fontSize = "0px"
      }
    })
  }
}
