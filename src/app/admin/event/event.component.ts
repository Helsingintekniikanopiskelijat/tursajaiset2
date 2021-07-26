import {Component, OnInit} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {RegionService} from 'src/app/services/admin-services/region.service';
import {TeamService} from 'src/app/services/team.service';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['../admin-styles.css', './event.component.css']
})
export class EventComponent implements OnInit {
  eventToEdit: TursasEvent
  editorState: EventState = EventState.EventList
  tursasEvents?: TursasEvent[]
  ticketsToCreate = 0
  constructor(private eventService: EventService, private messageService: MessagesService, private teamService: TeamService, private regionService: RegionService) {
    const now = new Date()
    this.eventToEdit = {active: true, date: now, name: 'Tursajaiset'}
  }

  ngOnInit() {
    this.eventService.getTursasEvents().subscribe(tursasEvents => {
      this.tursasEvents = []
      tursasEvents.forEach(tursasEvent => {
        const date = tursasEvent.date as any
        const timestamp = date.seconds * 1000
        tursasEvent.date = new Date(timestamp)
        this.tursasEvents?.push(tursasEvent)
      })
    })
  }

  async createNewEvent() {
    const activeEventsSubscription = this.eventService.getActiveTursasEvent()
    const activeEvents = await activeEventsSubscription.toPromise()
    for (let i = 0; i < activeEvents.length; i++) {
      const event = activeEvents[i];
      event.active = false
      await this.eventService.updateTursasEvent(event)
    }
    this.eventService.addTursasEvent(this.eventToEdit).then(() => this.messageService.add({message: 'Uusi tapahtuma lisätty', status: Status.Success})).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.eventToEdit = {active: true, date: now, name: 'Tursajaiset'}
    this.switchState(EventState.EventList)
  }

  updateEvent() {
    this.eventService.updateTursasEvent(this.eventToEdit).then(() => this.messageService.add({message: 'Tapahtuma päivitetty', status: Status.Success})).catch(error => this.messageService.add({message: error.toString(), status: Status.Error}))
    const now = new Date()
    this.eventToEdit = {active: true, date: now, name: 'Tursajaiset'}
    this.switchState(EventState.EventList)
  }

  switchState(state: EventState) {
    if (state == EventState.AddEvent) {
      const now = new Date()
      this.eventToEdit = {active: true, date: now, name: 'Tursajaiset'}
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

  editEvent(tursasEvent: TursasEvent) {
    this.eventToEdit = tursasEvent
    this.editorState = EventState.EditEvent
  }

  async createTeamsForEvent() {
    const activeEventsSubscription = this.eventService.getActiveTursasEvent().subscribe(async events => {
      if (events != undefined) {
        activeEventsSubscription.unsubscribe()
        console.log(activeEventsSubscription)
        const event = events[0]
        const regionSubscription = this.regionService.getRegions().subscribe(regions => {
          if (regions != undefined) {
            regionSubscription.unsubscribe()
            const ticketsPerRegion = this.ticketsToCreate / regions.length
            const randomLoginIds: number[] = []
            regions.forEach(region => {
              for (let i = 0; i < ticketsPerRegion; i++) {
                let randomNumber = Math.floor(1000 + Math.random() * 9000)
                while (randomLoginIds.includes(randomNumber)) {
                  randomNumber = Math.floor(1000 + Math.random() * 9000)
                }
                this.teamService.addTeam(event.id!, {loginId: randomNumber, totalScore: 0, bars: region.bars})
              }
            })
            this.messageService.add({message: 'Tiimit luotu', status: Status.Success})
            this.ticketsToCreate = 0
          }
        })

      }
    })
  }
}

enum EventState {
  AddEvent,
  EditEvent,
  EventList
}

