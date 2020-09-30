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
    return this.db.collection(this.collectionName, ref => ref.where('url', '==', url).limit(1)).valueChanges()
      .pipe(
        map(items => {
          return items.length ? items[0] as Config : null;
        })
      );
  }
}
