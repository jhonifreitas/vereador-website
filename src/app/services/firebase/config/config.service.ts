import { map } from 'rxjs/operators';
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

  get(url: string) {
    return this.db.collection<Config>(
      this.collectionName,
      ref => ref.where('url', '==', url).limit(1)
    ).snapshotChanges().pipe(
      map(actions => {
        if (actions.length) {
          const doc = actions[0].payload.doc;
          return {id: doc.id, ...doc.data()} as Config;
        }
      })
    );
  }

  getById(id: string) {
    return this.db.collection(this.collectionName).doc<Config>(id).snapshotChanges().pipe(
      map(action => {
        const doc = action.payload;
        return {id: doc.id, ...doc.data()} as Config;
      })
    );;
  }
}
