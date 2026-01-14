import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/admin-services/event.service';
import { TursasEvent } from 'src/app/models/tursas-event.model';

@Component({
  selector: 'app-admin-launch',
  templateUrl: './admin-launch.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './admin-launch.component.css']
})
export class AdminLaunchComponent implements OnInit {
  activeEvent: TursasEvent | null = null;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events && events.length > 0) {
        this.activeEvent = events[0];
      }
    });
  }
}
