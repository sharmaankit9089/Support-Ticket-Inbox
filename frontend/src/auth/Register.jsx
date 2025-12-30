import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", { name, email, password });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <input className="input w-full px-4 py-2 border rounded-lg" placeholder="Name" onChange={e => setName(e.target.value)} />
          <input className="input w-full px-4 py-2 border rounded-lg" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" className="input w-full px-4 py-2 border rounded-lg" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Register
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-blue-600 hover:underline"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
};

export default Register;
