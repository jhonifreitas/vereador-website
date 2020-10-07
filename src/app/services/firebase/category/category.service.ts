import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Category } from 'src/app/models/category';


@Injectable({
  providedIn: 'root'
})
export class FBCategoryService {

  private collectionName = '/categories';

  constructor(
    private db: AngularFirestore,
  ) { }

  all(configId: string) {
    return this.db.collection(this.collectionName, ref => ref.where('config', '==', configId).orderBy('order')).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Category;
          }
        })
      })
    );
  }
}
