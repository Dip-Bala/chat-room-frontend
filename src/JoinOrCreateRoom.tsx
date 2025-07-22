import { useContext, useState } from "react";
import { WSContext } from "./App";

export function JoinOrCreateRoom({ createdRoomId }: any) {
  const context = useContext(WSContext);
  const [inputRoomId, setInputRoomId] = useState("");

  function createRoom() {
    if (!context?.socketRef.current || context.socketRef.current.readyState !== WebSocket.OPEN) return;
    context.socketRef.current.send(JSON.stringify({ type: "create" }));
  }

  function joinRoom() {
    if (!context?.socketRef.current || context.socketRef.current.readyState !== WebSocket.OPEN) return;
    if (!inputRoomId.trim()) return;
    context.socketRef.current.send(JSON.stringify({
      type: "join",
      payload: { roomId: inputRoomId }
    }));
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <button onClick={createRoom} className="bg-[#f1f1f1] text-[#212121] px-4 py-2 rounded-md cursor-pointer w-full">
        Create Room
      </button>

      {createdRoomId &&
        <div className="w-full bg-[#222222] rounded-md p-2">
          Share this code with others: <strong>{createdRoomId}</strong>
        </div>
      }

      <div className="flex gap-2 ">
        <input value={inputRoomId} onChange={(e) => setInputRoomId(e.target.value)}
          placeholder="Enter the room Id" type="text"
          className="w-full p-2 border border-[#545454] focus:outline-2 focus:outline-cyan-300/90 rounded-md" />
        <button onClick={joinRoom} className="bg-[#f1f1f1] text-[#212121] px-4 py-2 rounded-md cursor-pointer ">
          Join
        </button>
      </div>
    </div>
  )
}
