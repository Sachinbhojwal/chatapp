import "../style/signup.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Signup({ setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!email || !password) return alert("Fill all fields");

    try {
      await createUserWithEmailAndPassword(
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
      <h2>Signup</h2>
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
      <button onClick={signup}>Signup</button>
      <p onClick={() => setMode("login")}>Already have account?</p>
    </div>
  );
}
