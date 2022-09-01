import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCM0Ufvh0Plx0atbLiyGJ4L0E--1dWXh60",
  authDomain: "learn-words-5d077.firebaseapp.com",
  databaseURL: "https://learn-words-5d077-default-rtdb.firebaseio.com",
  projectId: "learn-words-5d077",
  storageBucket: "learn-words-5d077.appspot.com",
  messagingSenderId: "369037970256",
  appId: "1:369037970256:web:2e4f2288a112769c733a55",
  measurementId: "G-TV4L6NC51S",
});

export const authentication = getAuth(firebaseConfig);
