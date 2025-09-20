// Login page
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();
  const [hover, setHover] = useState(false);

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

  const buttonStyle = {
    ...styles.button,
    ...(hover && styles.buttonHover),
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Notes Application</h1>

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

          <button type="submit" style={buttonStyle} disabled={loading} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
    background: "black",
    margin: 0, 
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    width: "380px",
    maxWidth: "400px",
    color: "#fff",
    padding: "2rem"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.8rem"
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
    padding: "12px",
    margin: "10px 0",
    marginBottom: "15px",
    border: "none",
    borderRadius: "10px",
    fontSize: "1 rem",
    width: "100%",
    background: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    outline: "none"
  },
  
  button: {
    width: "150px",
    margin: "auto",
    padding: "12px",
    background: "linear-gradient(90deg, #ffffff, #d9d9d9)",
    color: "#000",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    marginTop: "5px",
    transition: "all 0.3s ease", 
  },
  buttonHover: {
    color: "#fff",
    background: "linear-gradient(90deg, #000, #444)",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
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
