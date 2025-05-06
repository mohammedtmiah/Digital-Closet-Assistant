// Import the function to initialize a Firebase app
import { initializeApp } from "firebase/app";

// Your Firebase project's configuration details
const firebaseConfig = {
    apiKey: "AIzaSyDspR43qR8Pz0aGqpnCyquYOrwgjVOCZUw", // Auth key for accessing Firebase services
    authDomain: "digital-closet-assistant-7ece6.firebaseapp.com", // Domain for Firebase Auth
    projectId: "digital-closet-assistant-7ece6", // Unique Firebase project ID
    storageBucket: "digital-closet-assistant-7ece6.firebasestorage.app", // Cloud Storage bucket
    messagingSenderId: "750282886040", // ID for Firebase Cloud Messaging
    appId: "1:750282886040:web:91f16be34fdaa6b5e379ed", // Unique ID for this app instance
    measurementId: "G-54DQH59YGN" // ID for Google Analytics (optional)
};

// Initialize Firebase app with the config above
export const app = initializeApp(firebaseConfig); // Export initialized app for use in other files
