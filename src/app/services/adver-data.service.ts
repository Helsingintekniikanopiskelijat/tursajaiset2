import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {Bar} from 'src/app/models/bar.model';
import {Region} from 'src/app/models/region.model';
import {ScoreData} from 'src/app/models/score-data.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {AdverData} from '../models/adverData';

@Injectable({
  providedIn: 'root'
})
export class AdverDataService {


  constructor(public db: AngularFirestore) { }

  getAllAdverData(eventId: string): Observable<AdverData[]> {
    return this.db.collection('events').doc(eventId).collection('adverData').valueChanges({idField: 'id'}) as Observable<ScoreData[]>
  }

  getAdverData(id: string, eventId: string): Observable<AdverData> {
    return this.db.collection('events').doc(eventId).collection('adverData').doc(id).valueChanges({idField: 'id'}) as Observable<ScoreData>
  }

  async addAdverData(adverData: AdverData, eventId: string): Promise<void> {
    await this.db.collection('events').doc(eventId).collection('adverData').add(adverData)
    return
  }

  async deleteAdverData(scoreDataId: string, eventId: string) {
    await this.db.collection('events').doc(eventId).collection('adverData').doc(scoreDataId).delete().catch(error => console.log(error))
    return
  }
}
