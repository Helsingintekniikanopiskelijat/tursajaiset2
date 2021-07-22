import {Injectable} from '@angular/core';
import {SiteMessage} from 'src/app/models/site-message.model';

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  messages: SiteMessage[] = [];

  constructor() { }

  add(message: SiteMessage) {
    const index = this.messages.push(message);
    setTimeout(() => {
      this.messages.shift()

    }, 2000)
  }

}
