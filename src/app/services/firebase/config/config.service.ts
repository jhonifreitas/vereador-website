import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Config } from 'src/app/models/config';

@Injectable({
  providedIn: 'root'
})
export class FBConfigService {

  private collectionName = '/config';

  constructor(
    private db: AngularFirestore
  ) { }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Config>(id).valueChanges();
  }
}
