import { useContext } from "react";
import { userContext } from "./App";
import Chat from "./Chat";
const Route = () => {
  const { currentUser, currentId } = useContext(userContext);
  return (
    <div>
      <Chat />
    </div>
  );
};

export default Route;
