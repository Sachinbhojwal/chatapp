import '../style/chat.css';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("time"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(scrollToBottom, [messages]);

  const sendMsg = async () => {
    if (!msg || !auth.currentUser) return;

    await addDoc(collection(db, "messages"), {
      text: msg,
      uid: auth.currentUser.uid,
      time: Date.now(),
    });

    setMsg("");
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    await deleteDoc(doc(db, "messages", id));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="chat">
      {/* ===== Header ===== */}
      <div className="chat-header">
        <h3>My Chat</h3>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>

      {/* ===== Messages ===== */}
      <div className="messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.uid === auth.currentUser.uid ? "me" : "other"}
            onDoubleClick={() => m.uid === auth.currentUser.uid && deleteMsg(m.id)}
            title={m.uid === auth.currentUser.uid ? "Double-click to delete" : ""}
          >
            <span className="text">{m.text}</span>
            <span className="time">{formatTime(m.time)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== Input Box ===== */}
      <div className="inputBox">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg} disabled={!msg}>Send</button>
      </div>
    </div>
  );
}
