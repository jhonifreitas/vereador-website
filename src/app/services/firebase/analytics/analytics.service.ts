import { map } from 'rxjs/operators';
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

  get(ip: string): Promise<Analytics> {
    return new Promise(resolve => {
      this.db.collection(this.collectionName).doc<Analytics>(ip).get().toPromise().then(doc => resolve(doc.data() as Analytics));
    })
  }

  update(data: Analytics) {
    return this.db.collection(this.collectionName).doc(data.ip).set(data);
  }
}
