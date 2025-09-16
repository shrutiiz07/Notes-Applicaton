// Notes dashboard
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NoteEditor from "../components/NoteEditor";
import NoteList from "../components/NoteList";

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [plan, setPlan] = useState("free"); // default
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    // client-only values
    const [token, setToken] = useState(null);
    const [tenantSlug, setTenantSlug] = useState("");
    const [role, setRole] = useState("");

    const router = useRouter();

    // Load localStorage values after mount (client only)
    useEffect(() => {
        const t = localStorage.getItem("token");
        const tenant = localStorage.getItem("tenantSlug");
        const r = localStorage.getItem("role");

        setToken(t);
        setTenantSlug(tenant || "");
        setRole(r || "");

        if (!t) {
            router.push("/");
        } else {
            fetchNotes(t);
        }
    }, []);

    async function fetchNotes(t) {
        setLoading(true);
        try {
            const res = await fetch("/api/notes", {
                headers: { Authorization: `Bearer ${t}` },
            });
            const data = await res.json();
            if (res.ok) {
                setNotes(data.notes || []);
                if (data.tenant) setPlan(data.tenant.plan); // backend may return plan
            } else {
                setErr(data.message || "Failed to fetch notes");
            }
        } catch (e) {
            setErr("Error fetching notes");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(id, title, content) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/notes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();
            if (res.ok) {
                const updatedNote = data.note || data;
                setNotes((prev) =>
                    prev.map((n) => (n._id === id ? updatedNote : n))
                );
            } else {
                alert(data.message || "Update failed");
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return; // exit if user cancels

        try {
            const res = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setNotes(notes.filter((n) => n._id !== id));
            } else {
                console.error("Failed to delete note");
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleUpgrade() {
        try {
            const res = await fetch(`/api/tenants/${tenantSlug}/upgrade`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setPlan("pro");
                alert("Tenant upgraded to Pro!");
            } else {
                const data = await res.json();
                alert(data.message || "Upgrade failed");
            }
        } catch (e) {
            alert("Upgrade failed");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>📒 Notes Dashboard</h1>
                <p>
                    Tenant: <b>{tenantSlug || "..."}</b> | Role: <b>{role || "..."}</b> | Plan:{" "}
                    <b>{plan}</b>
                </p>

                {/* Note Editor */}
                {token && (
                    <NoteEditor
                        onCreate={(note) => setNotes([note, ...notes])}
                    />
                )}

                {err && <p style={styles.error}>{err}</p>}

                {/* Upgrade button (only if free plan and admin) */}
                {plan === "free" && role?.toLowerCase() === "admin" && notes.length >= 3 && (
                    <button onClick={handleUpgrade} style={styles.upgradeButton}>
                        🚀 Upgrade to Pro
                    </button>
                )}

                {/* Notes list */}
                <h2 style={{ marginTop: "20px" }}>Your Notes</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <NoteList
                        notes={notes}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}  
                    />
                )}
            </div>
        </div>
    );

}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f5f6fa",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
    },
    card: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        maxWidth: "700px",
        width: "100%",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "15px",
    },
    upgradeButton: {
        padding: "12px",
        background: "#28a745",
        color: "#fff",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px",
        width: "100%",
    },
    error: {
        color: "red",
        marginTop: "10px",
    },
};
