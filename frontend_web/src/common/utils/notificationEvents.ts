const NOTIFICATIONS_CHANGED_EVENT = "notifications:changed";

export function emitNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export function onNotificationsChanged(callback: () => void) {
  window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, callback);
  return () => window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, callback);
}