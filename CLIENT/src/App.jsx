import { useEffect, useRef, useState } from "react";
import socketInit from "./socket";
function App() {
  const socket = useRef(null);
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    socket.current = socketInit();
    // return () => {
    //  socket.current.disconnect();
    // };
  }, []);
  let data = [
    { id: 1, name: "Ram1" },
    { id: 2, name: "Ram2" },
    { id: 3, name: "Ram3" },
    { id: 4, name: "Ram4" },
    { id: 5, name: "Ram5" },
    { id: 6, name: "Ram6" },
    { id: 7, name: "Ram7" },
  ];
  const socketDataSend = (id, name) => {
    socket.current.emit("join-room", {
      id,
      name,
      socketId: socket.current.id,
    });
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("user-join-room", (data) => {
        console.log(data, "comming from backend");
        setUserList(data.userData);
      });
    }
  }, []);

  return (
    <div>
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => socketDataSend(item.id, item.name)}
          style={{
            padding: "10px",
            cursor: "pointer",
            border: "2px solid red",
          }}
        >
          {item.id}
        </div>
      ))}

      <br />
      <br />

      {userList.map((item) => (
        <div key={item.socketId}>{item.socketId}</div>
      ))}
    </div>
  );
}

export default App;
