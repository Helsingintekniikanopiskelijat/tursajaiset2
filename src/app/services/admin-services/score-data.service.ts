import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {Bar} from 'src/app/models/bar.model';
import {Region} from 'src/app/models/region.model';
import {ScoreData} from 'src/app/models/score-data.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreDataService {


  constructor(public db: AngularFirestore, private messageService: MessagesService) { }

  getAllScoreData(eventId: string): Observable<ScoreData[]> {
    return this.db.collection('events').doc(eventId).collection('scoredata').valueChanges({idField: 'id'}) as Observable<ScoreData[]>
  }

  getScoreDataWithId(id: string, eventId: string): Observable<ScoreData> {
    return this.db.collection('events').doc(eventId).collection('scoredata').doc(id).valueChanges({idField: 'id'}) as Observable<ScoreData>
  }


  async addScoreData(scoreData: ScoreData, eventId: string): Promise<void> {
    await this.db.collection('events').doc(eventId).collection('scoredata').add(scoreData)
    return
  }

  async deleteScoreData(scoreDataId: string, eventId: string) {
    await this.db.collection('events').doc(eventId).collection('scoredata').doc(scoreDataId).delete().catch(error => console.log(error))
    return
  }
}
