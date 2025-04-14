import { initializeApp, getApps, getApp } from "firebase/app"
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

console.log("Firebase confifgs loaded")

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

console.log("Firebase app initialized ");

const auth = getAuth(app)

console.log("Firebase auth instance created ");

// Set persistence to LOCAL so that the authentication session is saved across tabs/subdomains
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        // Firebase auth persistence successfully set
        console.log("Firebase auth persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Error setting Firebase auth persistence: ", error);
    });

export { auth }

