import { useState } from "react";

export default function NoteList({ notes, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  function startEdit(note) {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  if (!notes.length) return <p>No notes yet.</p>;

  return (
    <div style={styles.container}>
      {notes.map((note) => (
        <div key={note._id} style={styles.card}>
          {editingId === note._id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button
                onClick={() => {
                  onUpdate(note._id, editTitle, editContent);
                  setEditingId(null);
                }}
              >
                Save
              </button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{note.title}</h3>
              <p style={{color:"#e9ecf2ff"}}>{note.content}</p>
              <small style={{color:"#9ca3af"}}>
                Last updated: {new Date(note.updatedAt).toLocaleString()}
              </small>
              <br />
              <button style={styles.editBtn} onClick={() => startEdit(note)}>✐ Edit</button>
              <button
                style={styles.deleteBtn}
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this note?")) {
                    onDelete(note._id);
                  }
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { display: "grid", gap: "15px" },
  card: {
    background: "#3a3a3bff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    color: "#f3f4f6",
  },
  editBtn:{
    margin:"7px",
    marginTop: "5px",
    padding: "5px 9px",
    background: "#555555ff",
    color: "#f4e7e7ff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    margin:"7px",
    marginTop: "5px",
    padding: "5px 9px",
    background: "#ef4444",
    color: "#f4e7e7ff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

