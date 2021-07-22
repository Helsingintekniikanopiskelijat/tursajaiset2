import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore'
import {Site} from '../models/site.model'
import { Observable} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ItemService {

  itemsCollection?: AngularFirestoreCollection<Site>
  items: Observable<Site[]>

  constructor(public fs: AngularFirestore) {
    this.items = this.fs.collection('sites').valueChanges() as Observable<Site[]>
    //this.fs.collection('sites').doc('my-site').get()
  }

  getItems(){
    return this.items
  }
}

