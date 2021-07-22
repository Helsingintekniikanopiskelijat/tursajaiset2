import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {ImageService} from 'src/app/services/admin-services/image.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['../../admin-styles.css', './view-image.component.css']
})
export class ViewImageComponent implements OnInit {
  @Input() image?: {name: string, url: string, indexOnArray: number}
  @Output() imageDeleted = new EventEmitter<number>()
  constructor(private imageService: ImageService, private messagesService: MessagesService) { }

  ngOnInit() {
  }

  deleteImage() {
    this.hideImageView()
    this.imageDeleted.emit(this.image?.indexOnArray)
    this.imageService.deleteImage('public/' + this.image?.name).then(() => this.messagesService.add({message: 'Image deleted succesfully', status: Status.Success})).catch(error => this.messagesService.add({status: Status.Error, message: error}))
  }

  copyUrl() {
    if (this.image)
      navigator.clipboard.writeText(this.image.url).then(() => {this.messagesService.add({status: Status.Success, message: 'Url copied to clipboard'})})
  }

  hideImageView() {
    document.querySelector("#view-image")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#view-image-overlay") as any
    overlay.style.display = "none"
  }
}