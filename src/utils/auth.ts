export interface User {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = "users";

export const signupUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  
  // Check if email already exists
  if (users.find((u: User) => u.email === user.email)) {
    return { success: false, message: "Email already exists" };
  }

  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
};

export const loginUser = (email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u: User) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { success: true, user };
  } else {
    return { success: false, message: "Invalid email or password" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
};

export const isAuthenticated = () => !!getCurrentUser();
