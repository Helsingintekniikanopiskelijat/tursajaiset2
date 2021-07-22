import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {timeout} from 'rxjs/operators';
import {Status} from 'src/app/models/site-message.model';
import {ImageService} from 'src/app/services/admin-services/image.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['../../admin-styles.css', './add-image.component.css']
})
export class AddImageComponent implements OnInit {
  
  @Output() newImageEvent = new EventEmitter<{name: string, url: string}>()
  uploadTask: AngularFireUploadTask | null = null
  uploadPrecentage = 0
  uploadComplete = false

  constructor(private imageService: ImageService, private messageService: MessagesService) { }

  ngOnInit() {
  }
  async onSubmit(event: any) {
    this.uploadComplete = false
    const imageFile = event.target[0].files[0]
    const imageName = imageFile.name
    const uploadTask = this.imageService.uploadImage('/public/' + imageName, event.target[0].files[0])
    uploadTask.catch(error => this.messageService.add({status: Status.Error, message: error.message}))

    uploadTask.percentageChanges().subscribe(number => {
      number && (this.uploadPrecentage = number + 1)
      if (number && number >= 100 && !this.uploadComplete) {
        this.uploadComplete = true
        setTimeout(() => {
          this.uploadPrecentage = 0
          this.hideAddPage()
          this.messageService.add({status: Status.Success, message: "Image uploaded succesfully!"})
        }, 800)
      }
    });

    (await uploadTask).ref.getDownloadURL().then(dUrl =>
      this.newImageEvent.emit({url: dUrl, name: imageName})
    )
  }
  hideAddPage() {
    document.querySelector("#add-image")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#pop-form-overlay") as any
    overlay.style.display = "none"
  }
}
