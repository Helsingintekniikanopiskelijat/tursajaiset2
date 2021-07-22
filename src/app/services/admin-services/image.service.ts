import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage'
import {Reference} from '@angular/fire/storage/interfaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: AngularFireStorage) { }

  async getDirectoryRefs(path: string): Promise<Reference[]> {
    const listResult = await this.storage.ref(path).listAll().toPromise()
    return listResult.items
  }

  getImageLink(path: string): Observable<string | null> {
    return this.storage.ref(path).getDownloadURL()
  }

  uploadImage(path: string, file: any): AngularFireUploadTask {
    return this.storage.upload(path, file)
  }

  deleteImage(path: string): Promise<void> {
    const deleteTask = this.storage.ref(path).delete()
    return deleteTask.toPromise()
  }
}
