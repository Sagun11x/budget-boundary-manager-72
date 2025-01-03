import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY1l9DKJmaUDwliCZN1UgnpBsrzYkYGUY",
  authDomain: "adova-32393.firebaseapp.com",
  databaseURL: "https://adova-32393-default-rtdb.firebaseio.com",
  projectId: "adova-32393",
  storageBucket: "adova-32393.firebasestorage.app",
  messagingSenderId: "671682678254",
  appId: "1:671682678254:web:44dafed613bf19e901d2ff",
  measurementId: "G-LXRC5PJ4LR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);