import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Analytics } from 'src/app/models/analytics';

@Injectable({
  providedIn: 'root'
})
export class FBAnalyticsService {

  private collectionName = '/analytics';

  constructor(
    private db: AngularFirestore,
  ) { }

  get(ip: string, configId: string): Promise<Analytics> {
    return new Promise((resolve, reject) => {
      this.db.collection(
        this.collectionName, ref => ref.where('ip', '==', ip).where('config', '==', configId).limit(1)
      ).get().subscribe(actions => {
        if (!actions.empty) {
          const doc = actions.docs[0];
          resolve({id: doc.id, ...doc.data()} as Analytics);
        } else reject();
      });
    })
  }

  create(data: Analytics) {
    return this.db.collection(this.collectionName).add(data);
  }

  update(id: string, data: Partial<Analytics>) {
    return this.db.collection(this.collectionName).doc(id).update(data);
  }
}
