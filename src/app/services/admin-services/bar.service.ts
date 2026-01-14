import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData, QuerySnapshot} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {Bar} from 'src/app/models/bar.model';
import {Region} from 'src/app/models/region.model';
import {Team} from 'src/app/models/team.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {MessagesService} from './messages.service';
import {RegionService} from './region.service';
import {TeamService} from 'src/app/services/team.service';

@Injectable({
  providedIn: 'root'
})
export class BarService {


  constructor(public db: AngularFirestore, private messageService: MessagesService, private regionService: RegionService, private teamService: TeamService) { }

  getBars(): Observable<Bar[]> {
    return this.db.collection('bars', ref => ref.orderBy('name')).valueChanges({idField: 'id'}) as Observable<Bar[]>
  }

  getBar(id: string): Observable<Bar> {
    return this.db.collection('bars').doc(id).valueChanges({idField: 'id'}) as Observable<Bar>
  }

  getActiveTursasEvent(email: string): Observable<Bar[]> {
    return this.db.collection('bars', ref => ref.where('adminEmail', '==', email)).valueChanges({idField: 'id'}) as Observable<Bar[]>
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

  async updateAllBarsInfo(bars: Bar[]): Promise<boolean> {
    try {
      let regionsSub = this.db.collection('regions').valueChanges({idField: 'id'}).subscribe(data => {
        let regions = data as Region[]
        regions.forEach(async region => {
          bars.forEach((bar, barIndex) => {
            region.bars.forEach((regionBar, index) => {
              if (bar.id == regionBar.id) {
                region.bars[index] = bar
              }
            })
          })
          await this.regionService.updateRegion(region)
        })
        regionsSub.unsubscribe()
      })

      let eventSub = this.db.collection('events', ref => ref.where('active', '==', true)).valueChanges({idField: 'id'}).subscribe(eventData => {
        let teamSub = this.db.collection('events').doc(eventData[0].id).collection('teams').valueChanges({idField: 'id'}).subscribe(teamData => {
          let teams = teamData as Team[]
          teams.forEach(async team => {
            bars.forEach((bar, barIndex) => {
              team.bars.forEach((teamBar, teamBarIndex) => {
                if (bar.id == teamBar.id) {
                  const updatedBar = {
                    ...bar,
                    score: teamBar.score !== undefined ? teamBar.score : bar.score,
                    revealed: teamBar.revealed !== undefined ? teamBar.revealed : bar.revealed,
                    scoreComment: teamBar.scoreComment || ''
                  };
                  // Remove undefined values to avoid Firestore error
                  Object.keys(updatedBar).forEach(key => (updatedBar as any)[key] === undefined && delete (updatedBar as any)[key]);
                  team.bars[teamBarIndex] = updatedBar;
                }
              })
            })
            await this.teamService.updateTeam(eventData[0].id, team)
          })
          teamSub.unsubscribe()
        })
        eventSub.unsubscribe()
      })

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
