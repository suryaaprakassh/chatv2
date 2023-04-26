import { useContext, useState } from "react";
import axios from "axios";
import { userContext } from "./App";
const Register = () => {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useContext(userContext);
  const [isOldUser, setOldUser] = useState(false);
  return (
    <div className="bg-blue-50 h-screen flex items-center mb-12" method="post">
      <form
        className="w-64 mx-auto"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await axios.post("/register", {
            username,
            password,
          });
          setCurrentUser(username);
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
            <div className="text-center mt-2">
              Already a member?
              <button
                className="mx-2 text-blue-500 underline"
                onClick={() => {
                  setOldUser(true);
                }}
              >
                Login
              </button>
            </div>;
          }}
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-3">
          {isOldUser ? "Login" : "Register"}
        </button>
        {!isOldUser && (
          <div className="text-center mt-2">
            Already a member?
            <button
              className="mx-2 text-blue-500 underline"
              onClick={() => {
                setOldUser(true);
              }}
            >
              Login
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
