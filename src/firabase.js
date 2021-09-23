import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBr1r-i1cEBperSLEjcyTviRh4oM3pHVVo",
  authDomain: "seawar-6932d.firebaseapp.com",
  projectId: "seawar-6932d",
  storageBucket: "seawar-6932d.appspot.com",
  messagingSenderId: "321353568007",
  appId: "1:321353568007:web:7dc039d69fa84edb2b3fa2",
  measurementId: "G-YKD7RV5NH7",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
