import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {Region} from 'src/app/models/region.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {


  constructor(public db: AngularFirestore, private messageService: MessagesService) { }

  getRegions(): Observable<Region[]> {
    return this.db.collection('regions').valueChanges({idField: 'id'}) as Observable<Region[]>
  }

  getRegion(id: string): Observable<Region> {
    return this.db.collection('regions').doc(id).valueChanges({idField: 'id'}) as Observable<Region>
  }

  async addRegion(region: Region): Promise<void> {
    await this.db.collection('regions').add(region)
    return
  }

  async updateRegion(region: Region): Promise<boolean> {
    try {
      await this.db.collection('regions').doc(region.id).update(region)
    } catch (error) {
      console.log("error updating site", error)
      return false
    }
    return true
  }
  async deleteRegion(regionId: string) {
    await this.db.collection('regions').doc(regionId).delete().catch(error => console.log(error))
    return
  }
}
