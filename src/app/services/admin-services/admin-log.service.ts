import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AdminLog} from 'src/app/models/admin-log.model';

@Injectable({
  providedIn: 'root'
})
export class AdminLogService {

  constructor(public db: AngularFirestore) { }

  getAllLogs(eventId: string): Observable<AdminLog[]> {
    return this.db.collection('events').doc(eventId).collection('logs', ref => ref.orderBy('timestamp', 'desc')).valueChanges({idField: 'id'}) as Observable<AdminLog[]>
  }

  async addLog(log: AdminLog, eventId: string): Promise<void> {
    await this.db.collection('events').doc(eventId).collection('logs').add(log)
    return
  }

  async deleteLog(logId: string, eventId: string) {
    await this.db.collection('events').doc(eventId).collection('logs').doc(logId).delete().catch(error => console.log(error))
    return
  }
}
