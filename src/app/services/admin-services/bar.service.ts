import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {Bar} from 'src/app/models/bar.model';
import {Region} from 'src/app/models/region.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class BarService {


  constructor(public db: AngularFirestore, private messageService: MessagesService) { }

  getBars(): Observable<Bar[]> {
    return this.db.collection('bars').valueChanges({idField: 'id'}) as Observable<Bar[]>
  }

  getBar(id: string): Observable<Bar> {
    return this.db.collection('bars').doc(id).valueChanges({idField: 'id'}) as Observable<Bar>
  }

  async addBar(bar: Bar): Promise<void> {
    await this.db.collection('bars').add(bar)
    return
  }

  async updateBar(bar: Bar): Promise<boolean> {
    try {
      await this.db.collection('bars').doc(bar.id).update(bar)
    } catch (error) {
      console.log("error updating site", error)
      return false
    }
    return true
  }
  async deleteBar(barId: string) {
    await this.db.collection('bars').doc(barId).delete().catch(error => console.log(error))
    return
  }
}
