import { useRef, useEffect, useState, createContext, type RefObject } from "react";
import { InputMessageContainer } from './InputMessageContainer';
import { JoinOrCreateRoom } from "./JoinOrCreateRoom";

const ws_backend = import.meta.env.VITE_BACKEND_URL;

console.log(ws_backend)
interface WebSocketContextType {
  socketRef: RefObject<WebSocket | null>;
}

interface Message {
  sender: "server" | "client",
  message: string
}

export const WSContext = createContext<WebSocketContextType | undefined>(undefined);

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);


  useEffect(() => {
    const ws = new WebSocket(ws_backend);
    socketRef.current = ws;
    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      const { type } = parsedData;

      if (type === 'created') {
        setCreatedRoomId(parsedData.roomId);
      } else if (type === 'joinOrCreate' && parsedData.status === '404') {
        alert(parsedData.message);
      } else if (type === 'joined') {
        setRoomId(parsedData.roomId);
        setIsJoined(true);
      } else if (type === 'chat') {
        setAllMessages((prev) => [...prev, { sender: "server", message: parsedData.message }]);
      }
    };

    return () => {
      if (ws.readyState <= 1) ws.close();
    };
  }, []);

  return (
    <WSContext.Provider value={{ socketRef }}>
      <div className="bg-black w-screen h-screen text-white flex justify-center items-center font-mono p-4">
        <div className="flex flex-col border h-auto w-150 p-4 gap-4 border-[#545454] rounded-lg">
          <Header />
          {
            isJoined && roomId
              ? <InputMessageContainer roomId={roomId} allMessages={allMessages} setAllMessages={setAllMessages} />
              : <JoinOrCreateRoom createdRoomId={createdRoomId} />
          }
        </div>
      </div>
    </WSContext.Provider>
  );
}

export default App;

function Header() {
  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-lg">💬 Real Time Chat</h2>
      <p className="text-[#393E46] text-sm">Temporary room that will be deleted after all users exit</p>
    </div>
  );
}

