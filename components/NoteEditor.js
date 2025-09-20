import { useState } from "react";

export default function NoteEditor({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hover, setHover] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "Failed to create note");
      } else {
        setTitle("");
        setContent("");
        onCreate(data.note); // update parent list
      }
    } catch (error) {
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const buttonStyle = {
    ...styles.button,
    ...(hover && styles.buttonHover),
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
        required
      />
      <button type="submit" style={buttonStyle} disabled={loading} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {loading ? "Saving..." : "Add Note"}
      </button>
      {err && <p style={styles.error}>{err}</p>}
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "10px",
    fontSize: "1 rem",
    background: "rgba(255, 255, 255, 0.15)",
    outline: "none"
  },
  textarea: {
    minHeight: "80px",
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "10px",
    fontSize: "1 rem",
    background: "rgba(255, 255, 255, 0.15)",
    outline: "none"
  },
  button: {
    color: "#fbc933ff",
    border: " 3px solid #fbc933ff",
    cursor: "pointer",
    width: "140px",
    margin: "auto",
    padding: "10px",
    background: "linear-gradient(90deg, #ffffff, #d9d9d9)",
    fontWeight: "bold",
    fontSize: "1rem",
    borderRadius: "12px",
    marginTop: "20px",
    transition: "all 0.3s ease", 
  },
  buttonHover: {
    color: "#000",
    background: "linear-gradient(90deg, #fbc933ff, #ffd966)", // gold accent
    transform: "scale(1)",
    boxShadow: "0 4px 12px rgba(251, 201, 51, 0.4)",
},
  error: {
    color: "red",
    marginTop: "5px",
  },
};
