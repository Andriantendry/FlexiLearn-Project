import React, { useState } from "react";
import "../styles/verify_code.css";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", ""]);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const submitCode = async () => {
    const finalCode = code.join("");

    const res = await fetch("http://localhost:8000/user/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: finalCode }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user_id", data.id);
      localStorage.setItem("username", data.username);

      alert("Email confirmé !");
      navigate("/quiz");
    } else {
      alert(data.detail || "Code incorrect !");
    }
  };

  return (
    <div className="code-container">
      <h2>Enter the 4-digit code</h2>
      <p>We sent a code to your email</p>

      <div className="code-inputs">
        {code.map((digit, i) => (
          <input
            key={i}
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
          />
        ))}
      </div>

      <button onClick={submitCode}>Verify</button>
    </div>
  );
}
