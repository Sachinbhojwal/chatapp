import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import { useState } from "react";

export default function App() {
  const [user] = useAuthState(auth);
  const [mode, setMode] = useState("login");

  if (user) return <Chat />;

  return mode === "login" ? (
    <Login setMode={setMode} />
  ) : (
    <Signup setMode={setMode} />
  );
}
