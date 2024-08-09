import { useEffect, useState } from "react";
import "./output.css";
import { io } from "socket.io-client";

function App() {
  const [data, setData] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");

  const sendMessage = () => {
    if (data.trim()) {
      setMessages((prevMessages) => [...prevMessages, data]);
      socket?.emit("send-message", data, room);
      setData("");
    }
  };

  const joinRoom = () => {
    socket.emit("join-room", room);
    setMessages((prevMessages) => [...prevMessages, `Joined room : ${room}`]);
  };

  useEffect(() => {
    const socket = io("http://localhost:3009");
    setSocket(socket);

    socket.on("connect", () => {
      if (!socketId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          `Socket Id: ${socket.id}`,
        ]);
        setSocketId(socket.id);
      }
    });

    socket.on("receive-message", (a_message) => {
      setMessages((prevMessages) => [...prevMessages, a_message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="bg-black h-screen w-screen flex items-center justify-center text-white">
        <div className="bg-black h-[70vh] w-[30vw] flex flex-col items-center ">
          {/* Message box */}
          <div className="bg-black sm:w-[35vw] h-[50vh] lg:w-[25vw] overflow-y-auto mt-6 border p-3">
            {messages.map((item, index) => (
              <div className="" key={index}>
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center w-[20vw]">
            <div className="flex flex-row items-center justify-center">
              <div className="mt-5 p-3 ">
                <input
                  placeholder="Type a message..."
                  className="border border-b-2 p-1 border-gray-600 bg-black"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
              <div className="mt-4 ml-3  bg-black font-extrabold cursor-pointer">
                <button
                  className="text-sm p-1 pl-10   border-gray-400"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center">
              <div className="mt-0 p-3 ">
                <input
                  placeholder="Type a message..."
                  className="border border-b-2 p-1 border-gray-600 bg-black"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
              <div className="mt-0 ml-3  bg-black cursor-pointer font-extrabold">
                <button
                  className="text-sm font-bold w-20 p-1"
                  onClick={joinRoom}
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
