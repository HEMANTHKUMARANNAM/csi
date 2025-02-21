import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBwdGi-DSaiW8mm2kn3mNS2_NxsaHjPcS4",
  authDomain: "csievent-36427.firebaseapp.com",
  databaseURL: "https://csievent-36427-default-rtdb.firebaseio.com",
  projectId: "csievent-36427",
  storageBucket: "csievent-36427.firebasestorage.app",
  messagingSenderId: "567053551876",
  appId: "1:567053551876:web:0c85799b924a39cf256851",
  measurementId: "G-WFYHN22D7W"
};
// Initialize Firebase app (only if it hasn't been initialized yet)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);  // Use the initialized app for auth
const googleProvider = new GoogleAuthProvider();

const database = getDatabase(app);  // Use the initialized app for database

export {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  database,
};
