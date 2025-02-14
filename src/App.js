import React, { useState } from "react";

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
            });
            
            const data = await res.json();
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";
            setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Error fetching response", sender: "bot" }]);
        }
        
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="p-4 bg-blue-600 text-white text-center text-xl font-semibold">AI Chatbot</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-gray-800 self-start"}`}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && <div className="text-gray-500 italic">Bot is typing...</div>}
            </div>
            <div className="p-4 bg-white flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
                <button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Send</button>
            </div>
        </div>
    );
};

export default ChatBot;
