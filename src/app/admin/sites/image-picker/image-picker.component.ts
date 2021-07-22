import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Reference} from '@angular/fire/storage/interfaces';
import {ImageService} from 'src/app/services/admin-services/image.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['../../admin-styles.css', './image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePickedEvent = new EventEmitter<string>()
  imagesOnDisplay: {name: string, url: string}[] | null = null
  allImages: Reference[] = []
  currentImageIndex = 0
  constructor(private imageService: ImageService, private messageService: MessagesService) { }

  ngOnInit() {
    this.setInitialImages(20)
  }

  async loadMore(amount: number) {
    for (let i = this.currentImageIndex; i < this.currentImageIndex + amount; i++) {
      if (this.allImages[i] == undefined)
        break
      const image = this.allImages[i];
      const downLoadURL = await image.getDownloadURL()
      this.currentImageIndex++
      this.imagesOnDisplay?.push({name: image.name, url: downLoadURL})
    }
  }

  async setInitialImages(initialAmount: number) {
    this.allImages = await this.imageService.getDirectoryRefs('public/')
    this.imagesOnDisplay = []
    for (let i = 0; i < initialAmount; i++) {
      if (this.allImages[i] == undefined)
        break
      const image = this.allImages[i];
      const downLoadURL = await image.getDownloadURL()
      this.currentImageIndex++
      this.imagesOnDisplay.push({name: image.name, url: downLoadURL})
    }
  }

  hideImagePicker() {
    document.querySelector("#image-picker")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#image-picker-overlay") as any
    overlay.style.display = "none"
  }

  pickImage(imageIndex: number) {

    if (this.imagesOnDisplay) {
      this.imagePickedEvent.emit(this.imagesOnDisplay[imageIndex].url)
      this.hideImagePicker()
    }
  }
}
