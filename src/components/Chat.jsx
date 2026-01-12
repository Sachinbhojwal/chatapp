import '../style/chat.css';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("time"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

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

  return (
    <div className="chat">
      {/* ===== Logout Header ===== */}
      <div className="chat-header">
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>

      {/* ===== Messages ===== */}
      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.uid === auth.currentUser.uid ? "me" : "other"}
            onDoubleClick={() => m.uid === auth.currentUser.uid && deleteMsg(m.id)}
            title={m.uid === auth.currentUser.uid ? "Double-click to delete" : ""}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* ===== Input Box ===== */}
      <div className="inputBox">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Message likho..."
        />
        <button onClick={sendMsg} disabled={!msg}>Send</button>
      </div>
    </div>
  );
}
