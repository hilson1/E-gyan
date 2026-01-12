export function adminLogin(token) {
  localStorage.setItem("admin_token", token);
}

export function isAdminLoggedIn() {
  return !!localStorage.getItem("admin_token");
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
}
