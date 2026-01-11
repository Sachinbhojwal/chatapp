import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("time"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => doc.data()));
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

  return (
    <div className="chat">
      <button onClick={() => signOut(auth)}>Logout</button>

      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.uid === auth.currentUser.uid ? "me" : "other"}
          >
            {m.text}
          </div>
        ))}
      </div>

      <input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Message likho..."
      />
      <button onClick={sendMsg}>Send</button>
    </div>
  );
}
