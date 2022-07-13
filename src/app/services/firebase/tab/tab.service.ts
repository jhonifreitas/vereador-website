import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Tab } from 'src/app/models/tab';

@Injectable({
  providedIn: 'root'
})
export class FBTabService {

  private collectionName = '/tabs';

  constructor(
    private db: AngularFirestore,
  ) { }

  all(configId: string): Promise<Tab[]> {
    return new Promise(resolve => {
      this.db.collection(
        this.collectionName,
        ref => ref.where('config', '==', configId).orderBy('order')
      ).get().subscribe(actions => {
        const docs = actions.docs.map(doc => doc.data() as Tab);
        resolve(docs);
      });
    });
  }
}
