import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [browser, setBrowser] = useState<string>("");

  function sendMessage() {
    if (!socket || !inputRef.current || socket.readyState !== WebSocket.OPEN) return;
    const message = inputRef.current.value.trim();
    if (!message) return;
    socket.send(message);
    inputRef.current.value = ''; 
    setBrowser("");
  }

  useEffect(() => {
    const wss = new WebSocket('wss://ping-pong-websocket-1.onrender.com');
    setSocket(wss);

    wss.onmessage = (ev: MessageEvent) => {
      if (typeof ev.data === "string") {
        setBrowser(ev.data);
      }
    };

    // cleanup on unmount
    return () => {
      wss.close();
    };
  }, []);

  return (
    <>
      {browser && (
        <div>
          <p>{browser}</p>
        </div>
      )}
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={sendMessage}>Send Message</button>
    </>
  );
}

export default App;
