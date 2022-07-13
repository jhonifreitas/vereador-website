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

  all(configId: string): Promise<Social[]> {
    return new Promise(resolve => {
      this.db.collection(
        this.collectionName,
        ref => ref.where('config', '==', configId).orderBy('order')
      ).get().subscribe(actions => {
        const docs = actions.docs.map(doc => doc.data() as Social);
        resolve(docs);
      });
    });
  }
}
