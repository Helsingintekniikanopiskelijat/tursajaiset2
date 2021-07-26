import {Component, OnInit} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {AuthService} from 'src/app/services/auth.service';
import {TeamService} from 'src/app/services/team.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-frontend-login',
  templateUrl: './frontend-login.component.html',
  styleUrls: ['./frontend-login.component.css']
})
export class FrontendLoginComponent implements OnInit {
  rastiAdmin = false;
  teamLoginId?: number
  rastiAdminEmail?: string
  rastiAdminPassword?: string
  compLoading = true
  timeout = false
  activeEvent?: TursasEvent
  noActiveEvents = false
  timeoutSeconds = 0
  failedLogins = 0
  constructor(
    private eventService: EventService,
    private messageService: MessagesService,
    private teamService: TeamService,
    private authService: AuthService,
    private cookieService: CookieService) { }


  ngOnInit() {
    const eventSubscription = this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events != undefined) {
        this.compLoading = false
        eventSubscription.unsubscribe()
        if (events.length == 0) {
          const d = new Date()
          this.activeEvent = {active: false, name: 'no name', date: d}
          this.noActiveEvents = true
        }
        else {
          this.activeEvent = events[0]
          this.noActiveEvents = false
        }
      }
    })
  }

  scrollLoginScreen(rastiAdmin: boolean) {
    this.rastiAdmin = rastiAdmin
    let scrollAmount = 0
    if (rastiAdmin)
      scrollAmount = 9999

    const element = document.querySelector('#login-container')
    element?.scrollTo({left: scrollAmount, behavior: 'smooth'})
  }

  teamLogin() {
    this.compLoading = true
    const cookieValue = this.cookieService.get('failedLogin');
    if (cookieValue == 'true') {
      setTimeout(() => {
        this.messageService.add({message: 'Väärät tunnukset!', status: Status.Error})
      }, 500);
      this.startTimer(200)
      this.cookieService.set('failedLogin', 'true');
      return
    }
    if (this.activeEvent?.id != undefined && this.teamLoginId != undefined)
      this.teamService.getTeamByLoginId(this.activeEvent?.id, this.teamLoginId).subscribe(teams => {
        if (teams.length > 0) {
          window.location.href = `/#/teams/${this.activeEvent?.id}/${teams[0].id}`
        }
        else {
          this.failedLogins++
          this.messageService.add({message: 'Väärät tunnukset!', status: Status.Error})
          this.startTimer(40 * this.failedLogins)
          this.cookieService.set('failedLogin', 'true');
        }
      })
  }

  startTimer(duration: number) {
    var timer = duration, minutes, seconds;
    let intervalTimer = setInterval(() => {
      seconds = timer;
      seconds = seconds.toString()

      this.cookieService.set('failedLogin', 'true');

      if (seconds != undefined)
        this.timeoutSeconds = parseInt(seconds)

      if (--timer < 0) {
        this.compLoading = false
        this.timeoutSeconds = 0
        clearInterval(intervalTimer)
        this.cookieService.set('failedLogin', 'false');
      }
    }, 1000);
  }


  async rastiLogin() {
    this.compLoading = true
    if (this.rastiAdminEmail == undefined || this.rastiAdminPassword == undefined) {
      this.messageService.add({message: 'Tarkista kirjautumis kenttä', status: Status.Error})
      this.compLoading = false
    }
    else {
      const result = await this.authService.credentialSignin(this.rastiAdminEmail, this.rastiAdminPassword)
      if (result) {
        window.location.href = `/#/rastinpito`
      }
      else {
        this.compLoading = false
        this.scrollLoginScreen(true)
        this.messageService.add({message: 'Väärät tunnukset!', status: Status.Error})
      }

    }
  }

}
