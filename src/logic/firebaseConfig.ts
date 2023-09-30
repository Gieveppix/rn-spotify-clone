// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {doc, collection, increment, getDocs, getDoc, setDoc, updateDoc} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzSNsPqYjJJ3Gr-sa3xNLVrSMx6rhWj94",
  authDomain: "spotify-clone-39f75.firebaseapp.com",
  projectId: "spotify-clone-39f75",
  storageBucket: "spotify-clone-39f75.appspot.com",
  messagingSenderId: "892040010069",
  appId: "1:892040010069:web:901c4f9cc29953a09d37dc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

//init firestore service
export const db = firebase.firestore()

export const updateFirebaseDocument = async (trackId, trackName) => {
  try {
    const trackRef = doc(db, 'tracks', trackId); // Use the trackId as the document ID
    const trackSnapshot = await getDoc(trackRef);

    if (trackSnapshot.exists()) {
      // Track document exists, update the 'playCount' field
      await updateDoc(trackRef, {
        playCount: increment(1),
      });
    } else {
      // Track document doesn't exist, create a new one
      await setDoc(trackRef, {
        trackName: trackName,
        playCount: 1, // Initialize playCount to 1
      });
    }

    console.log(':::::::::::::::::::::::::::::::::::::::::Document updated successfully.:::::::::::::::::::::::::::::::::::::::::');
  } catch (error) {
    console.error(':::::::::::::::::::::::::::::::::::::::::Error updating document:::::::::::::::::::::::::::::::::::::::::', error);
  }
};

// Define a function to retrieve all tracks
export const getAllTracks = async () => {
  try {
    const tracksCollection = collection(db, 'tracks');
    const querySnapshot = await getDocs(tracksCollection);

    const tracks = [];
    querySnapshot.forEach((doc) => {
      tracks.push({
        id: doc.id, // The track ID
        data: doc.data(), // Track data including trackName and playCount
      });
    });

    return tracks;
  } catch (error) {
    console.error('Error retrieving tracks: ', error);
    return [];
  }
};

// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2023, 10, 29);
//     }
//   }
// }