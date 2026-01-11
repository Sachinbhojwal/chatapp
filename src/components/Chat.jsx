// src/components/Chat.jsx
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Query Firestore messages ordered by 'time'
    const q = query(collection(db, "messages"), orderBy("time"));
    
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => doc.data());
      console.log("LIVE SNAPSHOT:", data); // Debug log
      setMessages(data);
    });

    return () => unsub(); // Cleanup listener
  }, []);

  const sendMsg = async () => {
    if (!msg || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: msg,
        uid: auth.currentUser.uid,
        time: serverTimestamp(), // Use server timestamp
      });
      setMsg(""); // Clear input after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat">
      <div className="header">
        <h2>Chat Room</h2>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.uid === auth.currentUser.uid ? "me" : "other"}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="inputBox">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Message likho..."
        />
        <button onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
}
