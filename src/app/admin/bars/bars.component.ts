import {Component, OnInit} from '@angular/core';
import {Bar} from 'src/app/models/bar.model';
import {Status} from 'src/app/models/site-message.model';
import {BarService} from 'src/app/services/admin-services/bar.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['../admin-styles-2.css','../admin-styles.css', './bars.component.css']
})
export class BarsComponent implements OnInit {

  barToEdit: Bar
  editorState: BarEditorState = BarEditorState.BarList
  bars?: Bar[]
  emptyBar: Bar = {
    hint: { finn: 'baarin vihje', eng: 'bars hint' }, revealed: false, name: 'nimi', adminEmail: 'rastinpitäjän sähköposti', score: 0, googleLink: 'web linkki baariin, esim google maps linkki',
    finnish: true
  }
  constructor(private barService: BarService, private messageService: MessagesService) {
    const now = new Date()
    this.barToEdit = this.emptyBar
  }

  ngOnInit() {
    this.barService.getBars().subscribe(bars => {
      this.bars = bars
    })
  }

  createNewBar() {
    this.barService.addBar(this.barToEdit).then(() => this.messageService.add({message: 'Uusi Alue lisätty', status: Status.Success})).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.barToEdit = this.emptyBar
    this.switchState(BarEditorState.BarList)
  }

  updateBar() {
    this.barService.updateBar(this.barToEdit).then(() => this.messageService.add({message: 'Alue päivitetty', status: Status.Success})).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
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
  }
}

enum BarEditorState {
  AddBar,
  EditBar,
  BarList
}

