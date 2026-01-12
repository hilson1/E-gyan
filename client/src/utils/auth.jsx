export const auth = {
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  },

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  },

  setToken(token) {
    localStorage.setItem("token", token);
  },

  clear() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
  },
};
