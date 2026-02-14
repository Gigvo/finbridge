// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDY1jMfbtOtZ4ajey3yL3VKWF0pU3oqW7M',
    authDomain: 'finbridge-6ce90.firebaseapp.com',
    projectId: 'finbridge-6ce90',
    storageBucket: 'finbridge-6ce90.firebasestorage.app',
    messagingSenderId: '94741977362',
    appId: '1:94741977362:web:743ed16c58fc385f61fbcb',
    measurementId: 'G-24RS08XE5G',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
