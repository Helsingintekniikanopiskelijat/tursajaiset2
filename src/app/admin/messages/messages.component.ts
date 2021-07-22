import {Component, OnInit} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['../admin-styles.css', './messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {

  }

  backgroundColorParser(status: Status): string {
    switch (status) {
      case Status.Warning:
        return 'var(--admin-warning-color)'
        break;
      case Status.Error:
        return 'var(--admin-error-color)'
        break;
      default:
        return 'var(--admin-success-color)'
        break;
    }
  }

}
