import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(public db: AngularFirestore, private messageService: MessagesService) { }

  siteQuery?: AngularFirestoreCollection<DocumentData>
  lastDoc?: DocumentData
  category: string = 'default'
  limit = 5

  getTursasEvents(): Observable<TursasEvent[]> {
    return this.db.collection('events').valueChanges({idField: 'id'}) as Observable<TursasEvent[]>
  }

  getTursasEvent(id: string): Observable<TursasEvent> {
    return this.db.collection('events').doc(id).valueChanges({idField: 'id'}) as Observable<TursasEvent>
  }

  getActiveTursasEvent(): Observable<TursasEvent[]> {
    return this.db.collection('events', ref => ref.where('active', '==', true)).valueChanges({idField: 'id'}) as Observable<TursasEvent[]>
  }

  async addTursasEvent(tursasEvent: TursasEvent): Promise<void> {
    await this.db.collection('events').add(tursasEvent)
    return
  }

  async getTursasEventsFirstQuery(limit: number): Promise<TursasEvent[]> {
    this.limit = limit
    this.siteQuery = this.db.collection('events', ref => ref.orderBy('date').limit(limit))
    const snapshot = await this.siteQuery.get().toPromise()
    this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
    return snapshot.docs.map(doc => doc.data() as TursasEvent)
  }

  async getNextBatchOfTursasEvents(): Promise<TursasEvent[] | null> {
    try {
      this.siteQuery = this.db.collection('events', ref => ref.orderBy('date').startAfter(this.lastDoc).limit(this.limit))
      const snapshot = await this.siteQuery.get().toPromise()
      this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
      return snapshot.docs.map(doc => doc.data() as TursasEvent)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateTursasEvent(tursasEvent: TursasEvent): Promise<boolean> {
    try {
      await this.db.collection('events').doc(tursasEvent.id).update(tursasEvent)
    } catch (error) {
      console.log("error updating site", error)
      return false
    }
    return true
  }
  async deleteTursasEvent(tursasEventId: string) {
    await this.db.collection('events').doc(tursasEventId).delete().catch(error => console.log(error))
    return
  }
}
