import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
const Chat = () => {
  const [ws, setWs] = useState(null);
  const [currentOnline, setCurrentOnline] = useState({});
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
    const onlineUsers = JSON.parse(e.data);
    if ("online" in onlineUsers) {
      showOnlinePeople(onlineUsers.online);
    }
  }
  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 w-1/3">
        <div className="text-blue-600 font-bold text-3xl py-3">Chatter</div>
        {Object.keys(currentOnline).map((person) => {
          return (
            <div key={uuid()} className="py-2 border-b border-gray-100 ">
              {currentOnline[person]}
            </div>
          );
        })}
      </div>
      <div className="bg-blue-300 w-2/3 flex flex-col justify-between p-5">
        <div>messages</div>
        <div className="w-full flex align-center gap-2">
          <input
            type="text"
            placeholder="Type your message here "
            className="bg-white rounded-sm p-2 border flex-grow"
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
        </div>
      </div>
    </div>
  );
};

export default Chat;
