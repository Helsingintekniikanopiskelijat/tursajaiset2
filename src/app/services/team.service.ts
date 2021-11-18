import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {Team} from '../models/team.model';
import {MessagesService} from './admin-services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(public db: AngularFirestore, private messageService: MessagesService) { }

  siteQuery?: AngularFirestoreCollection<DocumentData>
  lastDoc?: DocumentData
  category: string = 'default'
  limit = 5

  getTeams(eventId: string): Observable<Team[]> {
    return this.db.collection('events').doc(eventId).collection('teams').valueChanges({idField: 'id'}) as Observable<Team[]>
  }

  getTeam(eventId: string, id: string): Observable<Team> {
    return this.db.collection('events').doc(eventId).collection('teams').doc(id).valueChanges({idField: 'id'}) as Observable<Team>
  }

  getTeamByLoginId(eventId: string, loginId: number): Observable<Team[]> {
    return this.db.collection('events').doc(eventId).collection('teams', ref => ref.where('loginId', '==', loginId)).valueChanges({idField: 'id'}) as Observable<Team[]>
  }

  getFuksiTeams(eventId: string): Observable<Team[]> {
    return this.db.collection('events').doc(eventId).collection('teams', ref => ref.where('fuksiStatus', '==', true)).valueChanges({idField: 'id'}) as Observable<Team[]>
  }

  getBestFuksiTeamShortedByScore(eventId: string): Observable<Team[]> {
    return this.db.collection('events').doc(eventId).collection('teams', ref => ref.where('fuksiStatus', '==', true).orderBy('totalScore', 'desc')).valueChanges({idField: 'id'}) as Observable<Team[]>
  }

  async addTeam(eventId: string, team: Team): Promise<void> {
    await this.db.collection('events').doc(eventId).collection('teams').add(team)
    return
  }

  async getTeamFirstQuery(eventId: string, limit: number): Promise<TursasEvent[]> {
    this.limit = limit
    this.siteQuery = this.db.collection('events').doc(eventId).collection('teams', ref => ref.orderBy('date').limit(limit))
    const snapshot = await this.siteQuery.get().toPromise()
    this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
    return snapshot.docs.map(doc => doc.data() as TursasEvent)
  }

  async getNextBatchOfTeams(eventId: string): Promise<TursasEvent[] | null> {
    try {
      this.siteQuery = this.db.collection('events').doc(eventId).collection('teams', ref => ref.orderBy('date').startAfter(this.lastDoc).limit(this.limit))
      const snapshot = await this.siteQuery.get().toPromise()
      this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
      return snapshot.docs.map(doc => doc.data() as TursasEvent)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateTeam(eventId: string, team: Team): Promise<boolean> {
    try {
      await this.db.collection('events').doc(eventId).collection('teams').doc(team.id).update(team)
    } catch (error) {
      console.log("error updating site", error)
      return false
    }
    return true
  }
  async deleteTeam(eventId: string, teamdId: string) {
    await this.db.collection('events').doc(eventId).collection('teams').doc(teamdId).delete().catch(error => console.log(error))
    return
  }
}
