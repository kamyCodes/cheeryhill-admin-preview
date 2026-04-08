// utils/notifications.js
export function notifyAdmin(notification) {
  window.dispatchEvent(
    new CustomEvent("admin:new-notification", {
      detail: notification,
    })
  );
}
