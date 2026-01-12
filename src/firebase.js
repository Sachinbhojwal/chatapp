import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-FDQrMOVZsv_qt_caLmpPC-lMmfEt01o",
  authDomain: "chat-94d7c.firebaseapp.com",
  projectId: "chat-94d7c",
  storageBucket: "chat-94d7c.appspot.com",
  messagingSenderId: "138739025351",
  appId: "1:138739025351:web:4ef0bbd112d5a303a945e2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
