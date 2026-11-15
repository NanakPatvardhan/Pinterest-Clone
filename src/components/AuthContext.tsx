import { createContext, useState, useEffect } from "react";

type User = {
  id: number;
  username: string;
  email: string;
};
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
  username: string,
  email: string,
  password: string
) => Promise<void>;
  logout: () => void;
  authLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [authLoading, setAuthLoading] = useState(true);
useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }
  setAuthLoading(false);
}, []);

async function login(email: string, password: string): Promise<void> {
const response = await fetch("http://localhost:5000/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

if (!response.ok) {
  throw new Error("Invalid email or password");

}
const data = await response.json();
setToken(data.token);
setUser(data.user);

localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
}
async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const response = await fetch("http://localhost:5000/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username, email, password }),
});
if (!response.ok) {
  const data = await response.json();
  throw new Error(data.error || "Registration failed");
}
await login(email, password);

}


function logout(): void {
localStorage.removeItem("token");
localStorage.removeItem("user");
setToken(null);
setUser(null);
}
return (<AuthContext.Provider value={{ user, token, authLoading, login, register, logout }}>
    {children}


  </AuthContext.Provider>
);
}