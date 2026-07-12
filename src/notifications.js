// Firebase Cloud Messaging helper
// Asks user permission and registers their push token in Firestore
// so sellers can be notified when someone messages them.

let messaging = null;

async function getMessaging() {
  if (messaging) return messaging;
  try {
    const { getMessaging: getFCM, getToken, onMessage } = await import("firebase/messaging");
    const { app } = await import("./firebase.js");
    if (!app) return null;
    messaging = getFCM(app);
    return messaging;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(userId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const m = await getMessaging();
    if (!m) return null;

    const { getToken } = await import("firebase/messaging");
    const { db } = await import("./firebase.js");
    const { doc, setDoc } = await import("firebase/firestore");

    const token = await getToken(m, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token && userId && db) {
      await setDoc(doc(db, "fcmTokens", userId), { token, updatedAt: new Date() });
    }
    return token;
  } catch (e) {
    console.warn("FCM setup failed:", e.message);
    return null;
  }
}

export async function onForegroundMessage(callback) {
  const m = await getMessaging();
  if (!m) return;
  const { onMessage } = await import("firebase/messaging");
  return onMessage(m, (payload) => {
    callback(payload.notification);
  });
}

// Show an in-app notification banner (used for foreground messages)
export function showInAppNotification({ title, body }) {
  const el = document.createElement("div");
  el.className = "in-app-notif";
  el.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 400);
  }, 4000);
}
