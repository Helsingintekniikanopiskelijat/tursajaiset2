import {Injectable} from '@angular/core';

import Firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import {from, merge, Observable, of} from 'rxjs';
import {switchMap, timeout} from 'rxjs/operators';
import {User} from '../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.user$ = this.afAuth.authState;
  }

  async googleSignin() {
    const provider = new Firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
  }

  async credentialSignin(email: string, password: string): Promise<boolean> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password)
      return true
    } catch (error) {
      return false
    }
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  async updateUserRecord(user: any): Promise<boolean> {
    try {
      await this.afs.collection('admins').doc(user.uid).set({displayName: user.displayName, email: user.email}, {merge: true})
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }


}
