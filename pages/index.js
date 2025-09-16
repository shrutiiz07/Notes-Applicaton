// Login page
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("tenantSlug", data.user.tenantSlug);
      localStorage.setItem("role", data.user.role);

      router.push("/notes");
    } catch (error) {
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Notes SaaS — Login</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {err && <p style={styles.error}>{err}</p>}
        </form>

        <p style={styles.note}>
          Test accounts:  
          <br /> admin@acme.test (Admin)  
          <br /> user@acme.test (Member)  
          <br /> admin@globex.test (Admin)  
          <br /> user@globex.test (Member)  
          <br /> <b>Password:</b> password
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    background: "#0070f3",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "5px",
  },
  error: {
    marginTop: "10px",
    color: "red",
    textAlign: "center",
  },
  note: {
    marginTop: "20px",
    fontSize: "14px",
    textAlign: "center",
    color: "#555",
  },
};
