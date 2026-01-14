import {Component, OnInit} from '@angular/core';
import {Bar} from 'src/app/models/bar.model';
import {Status} from 'src/app/models/site-message.model';
import {BarService} from 'src/app/services/admin-services/bar.service';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './bars.component.css']
})
export class BarsComponent implements OnInit {

  barToEdit: Bar
  editorState: BarEditorState = BarEditorState.BarList
  bars?: Bar[]
  emptyBar: Bar = {
    hint: {finn: 'baarin vihje', eng: 'bars hint'}, revealed: false, name: 'nimi', adminEmail: 'rastinpitäjän sähköposti', score: 0, googleLink: 'web linkki baariin, esim google maps linkki',
    finnish: true
  }
  constructor(private barService: BarService, private messageService: MessagesService, private eventService: EventService) {
    const now = new Date()
    this.barToEdit = this.emptyBar
  }

  ngOnInit() {
    this.barService.getBars().subscribe(bars => {
      this.bars = bars
    })
    this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events && events.length > 0) {
        // Just checking active event availability here if needed, or remove completely if unused
      }
    })
  }

  checkEventStatus() {
    this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events && events.length > 0) {
        const event = events[0];
        if (this.bars && this.bars.length > 0 && !event.barsCreated) {
          event.barsCreated = true;
          this.eventService.updateTursasEvent(event);
        }
      }
    })
  }

  createNewBar() {
    this.barService.addBar(this.barToEdit).then(() => {
      this.messageService.add({message: 'Uusi baari lisätty', status: Status.Success})
      this.checkEventStatus()
    }).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.barToEdit = this.emptyBar
    this.switchState(BarEditorState.BarList)
  }

  updateBar() {
    this.barService.updateBar(this.barToEdit).then(() => {
      this.messageService.add({message: 'baari päivitetty', status: Status.Success})
      this.checkEventStatus()
    }).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.barToEdit = this.emptyBar
    this.switchState(BarEditorState.BarList)
  }

  switchState(state: BarEditorState) {
    if (state == BarEditorState.AddBar) {
      this.barToEdit = this.emptyBar
    }
    this.editorState = state
  }

  updateAllBarInfo() {
    this.barService.updateAllBarsInfo(this.bars!).then(() => this.messageService.add({message: 'baarien tiedot päivitetty', status: Status.Success})).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
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

  editEvent(bar: Bar) {
    this.barToEdit = bar
    this.editorState = BarEditorState.EditBar
    this.checkEventStatus()
  }
}

enum BarEditorState {
  AddBar,
  EditBar,
  BarList
}

