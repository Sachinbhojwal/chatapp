import "../style/chat.css";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("time"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(scrollToBottom, [messages]);

  // Send message (text or image)
  const sendMsg = async () => {
    if (!msg && !image) return;
    if (!auth.currentUser) return;

    let imageUrl = null;

    // Upload image if selected
    if (image) {
      const storageRef = ref(storage, `chatImages/${Date.now()}_${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });

      setImage(null); // reset file input
    }

    // Add message to Firestore
    await addDoc(collection(db, "messages"), {
      text: msg || "",
      image: imageUrl || "",
      uid: auth.currentUser.uid,
      time: Date.now(),
    });

    setMsg("");
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    await deleteDoc(doc(db, "messages", id));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="chat">
      {/* Header */}
      <div className="chat-header">
        <h3>My Chat</h3>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.uid === auth.currentUser.uid ? "me" : "other"}
            onDoubleClick={() =>
              m.uid === auth.currentUser.uid && deleteMsg(m.id)
            }
            title={
              m.uid === auth.currentUser.uid ? "Double-click to delete" : ""
            }
          >
            {m.text && <span className="text">{m.text}</span>}
            {m.image && <img src={m.image} alt="sent" className="chat-img" />}
            <span className="time">{formatTime(m.time)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="inputBox">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />

        {/* Hidden file input */}
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Label with Font Awesome icon */}
        <label htmlFor="imageUpload" className="attach-icon" title="Send Image">
          <i className="fa-solid fa-paperclip"></i>
        </label>

        <button onClick={sendMsg} disabled={!msg && !image}>
          Send
        </button>
      </div>
    </div>
  );
}
