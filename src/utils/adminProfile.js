// utils/adminProfile.js
export function updateAdminProfile(updates) {
  const admin = JSON.parse(localStorage.getItem("admin")) || {};
  const updatedAdmin = { ...admin, ...updates };

  localStorage.setItem("admin", JSON.stringify(updatedAdmin));

  window.dispatchEvent(
    new CustomEvent("admin:profile-updated", {
      detail: updatedAdmin,
    })
  );
}
