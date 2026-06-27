// src/firebase.js
// Firebase setup for CampusCart.
// 1. Go to https://console.firebase.google.com -> Create a project
// 2. Enable: Authentication (Email/Password or Google), Firestore Database, Storage
// 3. Copy your config values into a .env file at the project root (see .env.example)

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db, storage;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (e) {
  console.warn("Firebase init skipped:", e.message);
}
export { app, auth, db, storage };

// ---------- Auth helpers ----------
const provider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ---------- Firestore: Listings ----------
const listingsRef = collection(db, "listings");

export async function addListing({ title, category, price, condition, sellerName, sellerEmail, imageUrl }) {
  return addDoc(listingsRef, {
    title,
    category,
    price: Number(price),
    condition,
    sellerName,
    sellerEmail,
    imageUrl: imageUrl || null,
    sold: false,
    createdAt: serverTimestamp(),
  });
}

export async function getAllListings() {
  const q = query(listingsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function markAsSold(listingId) {
  return updateDoc(doc(db, "listings", listingId), { sold: true });
}

export async function deleteListing(listingId) {
  return deleteDoc(doc(db, "listings", listingId));
}

// ---------- Storage: item photos ----------
export async function uploadItemImage(file, listingId) {
  const imageRef = ref(storage, `listings/${listingId}/${file.name}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

// ---------- Firestore: Wishlist (per user, subcollection) ----------
export async function toggleWishlist(userId, listingId, isWishlisted) {
  const wishRef = doc(db, "users", userId, "wishlist", listingId);
  if (isWishlisted) {
    return deleteDoc(wishRef);
  } else {
    return updateDoc(wishRef, { listingId }).catch(async () => {
      const { setDoc } = await import("firebase/firestore");
      return setDoc(wishRef, { listingId, addedAt: serverTimestamp() });
    });
  }
}

export async function getWishlist(userId) {
  const snap = await getDocs(collection(db, "users", userId, "wishlist"));
  return snap.docs.map((d) => d.id);
}
