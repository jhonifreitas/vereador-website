import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Social } from 'src/app/models/social';


@Injectable({
  providedIn: 'root'
})
export class FBSocialService {

  private collectionName = '/socials';

  constructor(
    private db: AngularFirestore,
  ) { }

  all(configId: string) {
    return this.db.collection(this.collectionName, ref => ref.where('config', '==', configId)).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Social;
          }
        })
      })
    );
  }
}
