import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentData, DocumentReference, Query, QuerySnapshot} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {Status} from 'src/app/models/site-message.model';
import {Site} from '../../models/site.model'
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  constructor(public db: AngularFirestore, private messageService: MessagesService) { }

  siteQuery?: AngularFirestoreCollection<DocumentData>
  lastDoc?: DocumentData
  category: string = 'default'
  limit = 5

  getSitesWithoutFilter(category: string): Observable<Site[]> {
    return this.db.collection('lvSiteCollection').doc(category).collection('sites', ref => ref.orderBy('date', 'desc')).valueChanges({idField: 'id'}) as Observable<Site[]>
  }

  getSitesWithPrivacyFilter(category: string, privacyFilter: boolean): Observable<Site[]> {
    return this.db.collection('lvSiteCollection').doc(category).collection('sites', ref => ref.where('public', '==', privacyFilter).orderBy('date', 'desc')).valueChanges({idField: 'id'}) as Observable<Site[]>
  }

  getSite(category: string, id: string): Observable<Site> {
    return this.db.collection('lvSiteCollection').doc(category).collection('sites').doc(id).valueChanges({idField: 'id'}) as Observable<Site>
  }

  getSiteByUrl(url: string): Query<any> {
    let collection = this.db.collection('lvSiteCollection').doc('default').collection('pages')
    return collection.ref.where('url', '==', url)
  }

  getSiteByUrlInCategory(url: string, category: string): Query<any> {
    let collection = this.db.collection('lvSiteCollection').doc(category).collection('pages')
    return collection.ref.where('url', '==', url)
  }

  getSiteRef(category: string, id: string): DocumentReference<any> {
    return this.db.collection('lvSiteCollection').doc(category).collection('sites').doc(id).ref
  }

  async addSite(category: string, site: Site): Promise<void> {
    await this.db.collection('lvSiteCollection').doc(category).collection('sites').doc(site.id).set(site)
    return
  }

  async getSitesInCategoryFirstQuery(category: string, limit: number): Promise<Site[]> {
    this.category = category
    this.limit = limit
    this.siteQuery = this.db.collection('lvSiteCollection').doc(category).collection('sites', ref => ref.where('public', '==', true).where('mainPage', '==', false).orderBy('date', 'desc').limit(limit))
    const snapshot = await this.siteQuery.get().toPromise()
    this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
    return snapshot.docs.map(doc => doc.data() as Site)
  }

  async getNextBatchOfSites(): Promise<Site[] | null> {
    try {
      this.siteQuery = this.db.collection('lvSiteCollection').doc(this.category).collection('sites', ref => ref.where('private', '==', true).where('mainPage', '==', false).orderBy('date', 'desc').startAfter(this.lastDoc).limit(this.limit))
      const snapshot = await this.siteQuery.get().toPromise()
      this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
      return snapshot.docs.map(doc => doc.data() as Site)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateSite(category: string, site: Site): Promise<boolean> {
    try {
      await this.db.collection('lvSiteCollection').doc(category).collection('sites').doc(site.id).update(site)
    } catch (error) {
      console.log("error updating site", error)
      return false
    }
    return true
  }
  async deleteSite(category: string, siteId: string) {
    await this.db.collection('lvSiteCollection').doc(category).collection('sites').doc(siteId).delete().catch(error => console.log(error))
    return
  }

  getSiteReadyDocumentObservable(category: string, site: Site): Observable<Site> {
    return this.db.collection('lvSiteCollection').doc(category).collection('sites').doc(site.id).valueChanges() as Observable<Site>
  }
}
