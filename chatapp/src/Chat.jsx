import { useEffect, useState, useContext } from "react";
import { v4 as uuid } from "uuid";
import { uniqBy } from "lodash";
import Avatar from "./Avatar";
import { userContext } from "./App";
const Chat = () => {
  const [ws, setWs] = useState(null);
  const [currentOnline, setCurrentOnline] = useState({});
  const [selectedPerson, setSelected] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { currentId } = useContext(userContext);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach((p) => {
      people[p.userId] = p.username;
    });
    setCurrentOnline(people);
  }

  function handleMessage(e) {
    const incomingData = JSON.parse(e.data);
    if ("online" in incomingData) {
      showOnlinePeople(incomingData.online);
    } else if ("text" in incomingData) {
      // const dup = uniqBy([...messages, { ...incomingData, byMe: false }], "id");
      // setMessages([...dup]);
      setMessages((prev) => [...prev, { ...incomingData, byMe: false }]);
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        message: {
          recepient: selectedPerson,
          text: newMessage,
        },
      })
    );
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        byMe: true,
        sender: currentId,
        recepient: selectedPerson,
        id: uuid(),
      },
    ]);
    setNewMessage("");
  }

  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 w-1/3">
        <div className="text-blue-400 font-bold text-3xl py-3">Chatter</div>
        {Object.keys(currentOnline).map((person) => {
          return (
            <div
              key={uuid()}
              className={
                "py-2 border-b border-gray-100 flex gap-2  items-center text-xl cursor-pointer " +
                (person == selectedPerson ? " bg-red-500 " : " ")
              }
              onClick={() => {
                setSelected(person);
                setMessages((prev) => [...prev]);
              }}
            >
              <Avatar />
              <span>{currentOnline[person]}</span>
            </div>
          );
        })}
      </div>
      <div className="bg-blue-300 w-2/3 flex flex-col justify-between p-5">
        {selectedPerson && (
          <div className="messages  w-full h-full flex flex-col">
            {uniqBy(messages, "id")
              .filter(
                (k) =>
                  (k.sender == selectedPerson && k.recepient == currentId) ||
                  (k.recepient == selectedPerson && k.sender == currentId)
              )

              .map((m) => {
                if (m.byMe) {
                  return (
                    <div
                      className="bg-green-300 p-5 m-4 rounded-md place-self-start"
                      key={uuid()}
                    >
                      {m.text}
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="bg-cyan-600 p-5 m-4 rounded-md place-self-end"
                      key={uuid()}
                    >
                      {m.text}
                    </div>
                  );
                }
              })}
          </div>
        )}
        {selectedPerson && (
          <form
            className="w-full flex align-center gap-2"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder="Type your message here "
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              className="bg-white rounded-sm p-2 border flex-grow"
              value={newMessage}
            />
            <button className="bg-blue-500 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
