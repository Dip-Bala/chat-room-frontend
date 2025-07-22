import { useContext, useRef } from "react";
import { WSContext } from "./App";

export function InputMessageContainer({ roomId, allMessages, setAllMessages }: any) {
    const textInputRef = useRef<HTMLInputElement | null>(null);
    const context = useContext(WSContext);

    function sendMessage() {
        if (!context?.socketRef.current || context.socketRef.current.readyState !== WebSocket.OPEN) return;
        const text = textInputRef.current?.value?.trim();
        if (!text) return;

        context.socketRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
                roomId: roomId,
                text: text
            }
        }));

        setAllMessages((m: any) => [...m, { sender: "client", message: text }]);
        if (textInputRef.current) textInputRef.current.value = "";
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="w-full bg-[#222222] rounded-md p-2 text-[#898989]">
                Room Code: <strong>{roomId}</strong>
            </div>
            <div className="border border-[#545454] w-full h-[500px] p-4 rounded-sm overflow-auto">
                {allMessages.map((message: any, idx: number) => (
                    <div key={idx} className={`mb-4 flex gap-2 ${message.sender === "server" ? 'justify-start': 'justify-end'}`} >
                        <span className={`p-2 rounded-sm ${message.sender === "server" ? "bg-white text-black" : "bg-[#222222]"}`}>
                            {message.message}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center w-full gap-4 ">
                <input ref={textInputRef} placeholder="write message ..." type="text"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                    className="w-full p-2 border border-[#545454] focus:outline-2 focus:outline-cyan-300/90 rounded-md" />
                <button onClick={sendMessage} className="bg-[#f1f1f1] text-[#212121] px-4 py-2 rounded-md cursor-pointer ">
                    Send
                </button>
            </div>
        </div>
    )
}
