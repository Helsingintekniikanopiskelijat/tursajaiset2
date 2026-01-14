import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {Bar} from 'src/app/models/bar.model';
import {Region} from 'src/app/models/region.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {TeamService} from 'src/app/services/team.service';
import {EventService} from './event.service';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {


  constructor(public db: AngularFirestore, private messageService: MessagesService, private eventService: EventService, private teamService: TeamService) { }

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

  async syncTeams(region: Region): Promise<number> {
    let updatedCount = 0;
    try {
      const events = await this.eventService.getActiveTursasEvent().pipe(take(1)).toPromise();
      if (events && events.length > 0) {
        for (const event of events) {
          const teams = await this.teamService.getTeams(event.id!).pipe(take(1)).toPromise();
          
          for (const team of teams) {
            if (team.regionName == region.regionCode) {
              const mergedBars: Bar[] = [];
              region.bars.forEach(regionBar => {
                const existingBar = team.bars.find(b => b.id == regionBar.id);
                if (existingBar) {
                  mergedBars.push(existingBar);
                } else {
                  mergedBars.push(regionBar);
                }
              });
              team.bars = mergedBars;
              await this.teamService.updateTeam(event.id!, team);
              updatedCount++;
            }
          }
        }
      }
    } catch (error) {
      console.log('Error syncing teams', error);
    }
    return updatedCount;
  }
}
