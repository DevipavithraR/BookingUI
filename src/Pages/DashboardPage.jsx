import { v4 as uuidv4 } from "uuid";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../store/slicers/themeSlice";

const DashboardPage = () => {
  const darkMode = useSelector(selectDarkMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

const token = localStorage.getItem("access_token");

const [conversations, setConversations] = useState(() => {
  const saved = localStorage.getItem("conversations");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem("conversations", JSON.stringify(conversations));
}, [conversations]);


const [activeConversationId, setActiveConversationId] = useState(null);

const createNewChat = () => {
  const newConversation = {
    id: uuidv4(),
    title: "New Chat",
    sessionId: null,
    approvalId: null,
    waitingApproval: false,
     lastUserMessage: null,
    messages: [
      { role: "assistant", content: "Hello! How can I help you today?" }
    ]
  };

  setConversations(prev => [newConversation, ...prev]);
  setActiveConversationId(newConversation.id);
};


const activeConversation = conversations.find(
  c => c.id === activeConversationId
);

const callChatAPI = async (payload) => {
  const token = localStorage.getItem("access_token");

  const res = await fetch("http://127.0.0.1:9000/api/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  // Check if response is streaming
  if (res.headers.get("Content-Type")?.includes("text/event-stream")) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const data = line.replace("data:", "").trim();
          fullMessage += (fullMessage ? "\n" : "") + data;
        }
      }
    }
    return fullMessage;
  } else {
    // Normal response (non-streaming)
    const data = await res.text();
    return data;
  }
};



  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = async () => {
  if (!input.trim() || !activeConversation) return;

  const userMessage = input;
  setInput("");

  // Add user message
  setConversations(prev =>
  prev.map(conv =>
    conv.id === activeConversationId
      ? {
          ...conv,
          lastUserMessage: userMessage, // ✅ SAVE ORIGINAL QUESTION
          messages: [...conv.messages, { role: "user", content: userMessage }]
        }
      : conv
  )
);

  const payload = activeConversation.sessionId
    ? { session_id: activeConversation.sessionId, message: userMessage }
    : { message: userMessage };

  const fullMessage = await callChatAPI(payload);

  const sessionMatch = fullMessage.match(/Session ID:\s*([a-zA-Z0-9-]+)/);
  const approvalMatch = fullMessage.match(/Approval ID:\s*(\d+)/);

  setConversations(prev =>
    prev.map(conv =>
      conv.id === activeConversationId
        ? {
            ...conv,
            sessionId: sessionMatch ? sessionMatch[1] : conv.sessionId,
            approvalId: approvalMatch ? approvalMatch[1] : null,
            waitingApproval: Boolean(approvalMatch),
            messages: [
              ...conv.messages,
              { role: "assistant", content: fullMessage }
            ]
          }
        : conv
    )
  );
};


const approveAction = async () => {
  if (!activeConversation?.approvalId) return;

  // 1️⃣ Call approve API
  await fetch(
    `http://127.0.0.1:9000/api/approvals/${activeConversation.approvalId}/approve`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );

  // 2️⃣ Request backend to continue the previously pending action
  const finalMessage = await callChatAPI({
    session_id: activeConversation.sessionId,
    message: "continue" // ✅ key fix
  });

  // 3️⃣ Update conversation
  setConversations(prev =>
    prev.map(conv =>
      conv.id === activeConversationId
        ? {
            ...conv,
            waitingApproval: false,
            approvalId: null,
            messages: [...conv.messages, { role: "assistant", content: finalMessage }]
          }
        : conv
    )
  );
};

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40
          w-64 h-full
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300
         
          border-r dark:border-gray-700
        `}

        
      >
        <div className={`h-full w-64" ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
 {/* New Chat */}
<button
  onClick={createNewChat}
  className={`p-4 font-semibold w-full text-left text-black 
             ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
             `}
>
  + New Chat
</button>

{/* Conversations */}
<div className="p-2 space-y-1 overflow-auto h-[calc(100%-56px)]">
  {conversations.map(conv => (
    <button
      key={conv.id}
      onClick={() => setActiveConversationId(conv.id)}
      className={`w-full text-left px-3 py-2 rounded
        ${activeConversationId === conv.id
          ? "bg-gray-300 dark:bg-gray-700 text-black"
          : "hover:bg-gray-200 dark:hover:bg-gray-700 text-white"}
       
      `}
    >
      {conv.title}
    </button>
  ))}
</div>



</div>

      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col relative">

        {/* Mobile Top Bar */}
        <div
          className={`md:hidden flex items-center gap-3 px-4 py-3 shadow 
          ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
        >
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="font-medium">Chat</span>
        </div>

        {/* Messages */}
       <div className="flex-1 overflow-auto px-4 py-6">
  <div className="max-w-6xl mx-auto space-y-6">
   {activeConversation?.messages.map((msg, index) => (
  <div
    key={index}
    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`
        max-w-[80%] px-4 py-3 rounded-2xl text-sm
        ${msg.role === "user"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"}
      `}
    >
      {msg.content}
    </div>
  </div>
))}

    <div ref={messagesEndRef} />
  </div>
</div>

        {/* Input */}
        <div
          className={`border-t px-4 py-3 
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <div className="flex items-center gap-6 max-w-6xl mx-auto">
          {activeConversation?.waitingApproval && (

  <div className="px-4 py-2 text-center">
    <button
      onClick={approveAction}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      Approve Action
    </button>
  </div>
)}

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Send a message..."
              className="flex-1 rounded-lg px-4 py-6 text-sm
                bg-gray-100 dark:bg-gray-700 dark:text-white outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Send
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
