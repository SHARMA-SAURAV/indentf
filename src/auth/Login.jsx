import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;
        localStorage.setItem("token", token); 
    //   console.log("Login response:", res.data); // Debugging line
    //   console.log("Response data:", res.data.token); // Debugging line
    //   const { token } = res.data.token;
    //   console.log("Token received:", token); // Debugging line

      // Optional: fetch user details and roles after login
      const userRes = await api.get("/auth/me"); // example user info endpoint
      const user = userRes.data;

      setAuthData({ token, user, currentRole: user.roles[0] });
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
