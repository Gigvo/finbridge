import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDY1jMfbtOtZ4ajey3yL3VKWF0pU3oqW7M',
    authDomain: 'finbridge-6ce90.firebaseapp.com',
    projectId: 'finbridge-6ce90',
    storageBucket: 'finbridge-6ce90.firebasestorage.app',
    messagingSenderId: '94741977362',
    appId: '1:94741977362:web:743ed16c58fc385f61fbcb',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
