import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics"
import { getDatabase, ref, update, set, onValue } from "firebase/database"
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState, useEffect, useCallback } from 'react'
import bus from './bus'
import { v4 as uuid } from 'uuid'

const firebaseConfig = {
  apiKey: "AIzaSyBr1r-i1cEBperSLEjcyTviRh4oM3pHVVo",
  authDomain: "seawar-6932d.firebaseapp.com",
  databaseURL: "https://seawar-6932d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "seawar-6932d",
  storageBucket: "seawar-6932d.appspot.com",
  messagingSenderId: "321353568007",
  appId: "1:321353568007:web:7dc039d69fa84edb2b3fa2",
  measurementId: "G-YKD7RV5NH7",
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  bus.emit('userChanged', user)
})

/*
 const db = getDatabase(app)
 const dbRef = ref(db, `users/{userUid}`)
 update(dbRef, {displayName: "Firebase9_IsCool"}).then(() => {
 console.log("Data updated");
 }).catch((e) => {
 console.log(e);
 })
 */

const database = getDatabase(app)
const roomsRef = ref(database, '/rooms/')

export const db = {
  ref: (path) => ref(database, path),
  on: (path, cb) => onValue(ref(database, path), (snapshot) => {
    cb(snapshot.val())
  }),
  createRoom: (name) => {
    const user = auth.currentUser
    const id = uuid()

    set(ref(database, `/rooms/${ id }`), {
      id, name,
      created_at: new Date().toISOString(),
      author: {
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
      },
    }).catch(() => {})
  },
  updateRoom: (id, data) => {

  },
}

export function useAuth() {
  const [user, setUser] = useState(auth.currentUser)

  useEffect(() => {
    bus.on('userChanged', setUser)
    return () => bus.off('userChanged', setUser)
  }, [])

  const login = useCallback(() => {
    if (user) return () => {}

    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user
        console.log(token, user)
      }).catch(() => {})
  }, [user])

  // console.log(user)
  return { user, login }
}
