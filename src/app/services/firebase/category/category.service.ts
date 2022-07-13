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

  all(configId: string): Promise<Category[]> {
    return new Promise(resolve => {
      this.db.collection(
        this.collectionName,
        ref => ref.where('config', '==', configId).orderBy('order')
      ).get().subscribe(actions => {
        const docs = actions.docs.map(doc => doc.data() as Category);
        resolve(docs);
      });
    });
  }
}
