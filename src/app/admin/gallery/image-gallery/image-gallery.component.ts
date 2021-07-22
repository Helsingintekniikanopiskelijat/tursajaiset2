import {Component, OnInit} from '@angular/core';
import {Reference} from '@angular/fire/storage/interfaces';
import {Status} from 'src/app/models/site-message.model';
import {ImageService} from 'src/app/services/admin-services/image.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['../../admin-styles.css', './image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {

  imagesOnDisplay: {name: string, url: string}[] | null = null
  allImages: Reference[] = []
  currentImageIndex = 0

  selectedImage?: {name: string, url: string, indexOnArray: number}

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

  addImageToDisplay(newImage: {name: string, url: string}) {
    this.imagesOnDisplay?.unshift(newImage)
  }

  clickedImage(imageClicked: {name: string, url: string, indexOnArray: number},) {
    this.selectedImage = imageClicked
    setTimeout(() => this.showOverlay('view-image', 'view-image-overlay'), 50)
  }

  removeImageFromDisplay(index: number) {
    this.imagesOnDisplay?.splice(index, 1)
  }

  showOverlay(menuId: string, overlayId: string) {
    document.querySelector("#" + menuId)?.classList.remove('overlay-hidden')
    let overlay = document.querySelector("#" + overlayId) as any
    overlay.style.display = "initial"
  }

}

