import {Component, OnInit} from '@angular/core';
import {Bar} from 'src/app/models/bar.model';
import {Region} from 'src/app/models/region.model';
import {Status} from 'src/app/models/site-message.model';
import {BarService} from 'src/app/services/admin-services/bar.service';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {RegionService} from 'src/app/services/admin-services/region.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './region.component.css']
})
export class RegionComponent implements OnInit {

  regionToEdit: Region
  editorState: RegionEditorState = RegionEditorState.RegionList
  regions?: Region[]
  bars?: Bar[]
  emptyRegion: Region = {regionCode: "", bars: []}
  constructor(private barService: BarService, private regionService: RegionService, private messageService: MessagesService, private eventService: EventService, private teamService: TeamService) {
    const now = new Date()
    this.regionToEdit = this.emptyRegion
  }

  ngOnInit() {
    this.regionService.getRegions().subscribe(regions => {
      this.regions = regions
    })
    this.barService.getBars().subscribe(bars => {
      this.bars = bars
    })
    this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events && events.length > 0) {
        const event = events[0];
        if (this.regions && this.regions.length > 0 && !event.regionsCreated) {
          event.regionsCreated = true;
          this.eventService.updateTursasEvent(event);
        }
      }
    })
  }

  checkEventStatus() {
    this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events && events.length > 0) {
        const event = events[0];
        if (this.regions && this.regions.length > 0 && !event.regionsCreated) {
          event.regionsCreated = true;
          this.eventService.updateTursasEvent(event);
        }
      }
    })
  }

  createNewRegion() {
    if (!this.checkIfLoppurastiExists()) {
      this.messageService.add({message: 'Varoitus: Loppurasti puuttuu alueelta!', status: Status.Warning})
    }
    this.regionService.addRegion(this.regionToEdit).then(() => {
      this.messageService.add({message: 'Uusi Alue Lisätty', status: Status.Success})
      this.checkEventStatus()
    }).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.regionToEdit = this.emptyRegion
    this.switchState(RegionEditorState.RegionList)
  }

  updateRegion() {
    if (!this.checkIfLoppurastiExists()) {
      this.messageService.add({message: 'Varoitus: Loppurasti puuttuu alueelta!', status: Status.Warning})
    }
    this.regionService.updateRegion(this.regionToEdit).then(() => {
      this.messageService.add({message: 'Alue Päivitetty', status: Status.Success})
      this.checkEventStatus()
    }).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.regionToEdit = this.emptyRegion
    this.switchState(RegionEditorState.RegionList)
  }

  deleteRegion() {
    this.regionService.deleteRegion(this.regionToEdit.id!).then(() => this.messageService.add({message: 'Alue Poistettu', status: Status.Success})).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    this.regionToEdit = this.emptyRegion
    this.switchState(RegionEditorState.RegionList)
  }

  switchState(state: RegionEditorState) {
    if (state == 0) {
      this.regionToEdit = this.emptyRegion
    }
    this.editorState = state
  }

  editButtonHover(id: string, activate: boolean) {
    let element = document.querySelector('#' + id + '-path1')
    let element2 = document.querySelector('#' + id + '-path2')
    if (activate) {
      element?.classList.add('green-color')
      element2?.classList.add('green-color')
    }
    else {
      element?.classList.remove('green-color')
      element2?.classList.remove('green-color')
    }
  }

  parseDate(dateString: any): Date {
    dateString = dateString.value
    if (dateString) {
      return new Date(dateString);
    }
    const now = new Date()
    return now;
  }

  parseDateFromTimeStamp(date: Date) {
    const tDate = date.toLocaleDateString("fi")
    return tDate
  }

  editRegion(region: Region) {
    this.regionToEdit = region
    this.editorState = RegionEditorState.EditRegion
    this.checkEventStatus()
  }

  addBarToCurrentRegion(bar: Bar) {
    this.regionToEdit.bars.push(bar)
  }

  removeBarFromCurrentRegion(index: number) {
    if (this.regionToEdit.bars[index].id == 'IF2UKc25Hsy5us0AUDvD') {
      this.messageService.add({message: 'Varoitus: Poistat loppurastin!', status: Status.Warning})
    }
    this.regionToEdit.bars.splice(index, 1)
  }

  checkIfLoppurastiExists(): boolean {
    let exists = false
    this.regionToEdit.bars.forEach(bar => {
      if (bar.id == 'IF2UKc25Hsy5us0AUDvD') {
        exists = true
      }
    })
    return exists
  }

  getBarUniqueColor(selectedBar: Bar) {
    const customColors = ['green', 'olive', 'darkseagreen', 'teal', 'cyan', 'royalblue', 'CornflowerBlue', 'Crimson', 'OrangeRed', 'Brown', 'darkviolet', 'Gold', 'Indigo']
    let color = 'green'
    this.bars?.forEach((bar, index) => {
      if (selectedBar.name == bar.name) {
        color = customColors[index]
      }
    })
    return color
  }

  syncTeams() {
    this.regionService.syncTeams(this.regionToEdit).then(updatedCount => {
      if (updatedCount > 0) {
        this.messageService.add({message: `Synkronoitiin ${updatedCount} tiimiä`, status: Status.Success})
      } else {
        this.messageService.add({message: 'Ei löytynyt tiimejä tällä aluekoodilla', status: Status.Warning})
      }
    });
  }
}

enum RegionEditorState {
  AddRegion,
  EditRegion,
  RegionList
}
