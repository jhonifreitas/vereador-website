import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Config } from 'src/app/models/config';

@Injectable({
  providedIn: 'root'
})
export class FBConfigService {

  private collectionName = '/config';

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  getByUrl(url: string) {
    return this.db.collection(this.collectionName, ref => ref.where('url', '==', url).limit(1)).get().pipe(
      map(actions => {
        if(!actions.empty){
          const doc = actions.docs[0];
          return doc.data() as Config;
        }
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc(id).get().pipe(
      map(doc => {
        return doc.data() as Config;
      })
    );
  }
}
