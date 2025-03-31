import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection, addDoc, CollectionReference, DocumentReference, getDocs, getDoc, doc, query, where, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {  
  constructor(private firestore: Firestore) {}

  // Метод для добавления документа в коллекцию
  async addDocument(collectionName: string, data: any) {
    const result = await addDoc(collection(this.firestore, collectionName), data)
    return result;
  }

  async updateDocument(collectionName: string, data: any) {
    const result = await setDoc(doc(this.firestore, collectionName, data.id), data)
    return result;
  }

  // Пример метода для получения всех документов из коллекции
  async getDoc(collectionName: string, param?: any) {
    // const result = await getDocs(collection(this.firestore, collectionName))
    // const result = await getDoc(doc(this.firestore, collectionName, "u3PteIyUNebrhjxDH0hN"))
    const result = await getDoc(doc(this.firestore, collectionName, param));
    return result;
    // return this.firestore.collection(collectionName).valueChanges();
  }
  async getCollectionsQuery(collectionName: string, param?: any) {
    // const result = await getDocs(collection(this.firestore, collectionName))
    // const result = await getDoc(doc(this.firestore, collectionName, "u3PteIyUNebrhjxDH0hN"))
    console.log(param);
    const q = query(collection(this.firestore, collectionName), where("user_uid", "==", param.user_uid));
    const result = await getDocs(q)
    return result;
    // return this.firestore.collection(collectionName).valueChanges();
  }

}
