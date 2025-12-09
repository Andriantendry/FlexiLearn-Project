import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8001/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      console.log(data);
      setMessage(data.message || "Inscription réussie");
    } catch (err) {
      setMessage("Erreur: " + err.message);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Créer le compte</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
