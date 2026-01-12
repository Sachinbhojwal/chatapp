import '../style/login.css'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Login({ setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) return alert("Fill all fields");

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
    } catch (err) {
      alert(err.code);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <p onClick={() => setMode("signup")}>Create account</p>
    </div>
  );
}
