import { useState } from "react";
import axios from "axios";
const Register = () => {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-blue-50 h-screen flex items-center mb-12" method="post">
      <form
        className="w-64 mx-auto"
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("Ran");
          await axios.post("http://localhost:5000/register", {
            username,
            password,
          });
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          placeholder="username"
          className="block w-full rounded-sm p-3 mb-4"
        />
        <input
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-3 mb-4"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
