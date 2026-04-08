// utils/dashboardSearch.js
export function dispatchDashboardSearch(query) {
  window.dispatchEvent(
    new CustomEvent("admin:search", {
      detail: query,
    })
  );
}
