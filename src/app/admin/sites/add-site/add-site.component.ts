import {Component, Input, OnInit} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {Site} from 'src/app/models/site.model';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {SitesService} from 'src/app/services/admin-services/sites.service';
@Component({
  selector: 'add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css', '../../admin-styles.css']
})
export class AddSiteComponent implements OnInit {
  @Input() category: string = 'default'
  site: Site = {
    id: '',
    title: '',
    public: false,
    mainPage: false,
    components: [],
    metaTags: []
  }
  constructor(private siteService: SitesService, private messageService: MessagesService) { }

  ngOnInit() {
  }

  async onSubmit() {
    if (this.site.id == '' || this.site.title == '') {
      this.messageService.add({status: Status.Warning, message: 'Some of the values are empty!'})
      return
    }

    let snapshot = this.siteService.getSiteRef(this.category, this.site.id)
    let documents = await snapshot.get()

    if (documents.exists) {
      this.messageService.add({status: Status.Error, message: 'Site already exists'})
      return
    }

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let d = new Date()

    this.site.dateStringSort = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    this.site.dateStringFull = d.toLocaleString()
    this.site.date = d

    if (this.site.id == 'frontpage')
      this.site.mainPage = true
    else
      this.site.mainPage = false
    await this.siteService.addSite(this.category, this.site)
    this.site.id = ''
    this.site.title = ''
    this.hideAddPage()

    this.messageService.add({status: Status.Success, message: 'New site added!'})
    return
  }

  titleUpdate() {
    this.site.id = this.site.title.replace(/ /g, "_")
  }

  hideAddPage() {
    document.querySelector("#add-site")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#hide-page-overlay") as any
    overlay.style.display = "none"
  }
}
