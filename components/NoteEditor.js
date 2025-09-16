import { useState } from "react";

export default function NoteEditor({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
      <button type="submit" style={styles.button} disabled={loading}>
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
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "80px",
  },
  button: {
    padding: "10px",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "5px",
  },
};
