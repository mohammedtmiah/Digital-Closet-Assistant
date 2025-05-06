


// Import useState hook from React
import { useState } from "react";

// Chatbot component takes in `items` (the user's wardrobe)
const Chatbot = ({ items }) => {
  // State for whether the chatbot is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // State for chat messages, starting with an assistant greeting
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your wardrobe assistant. Ask me to build you an outfit! You can say things like 'Make me a formal outfit' or 'What should I wear in summer?'",
    },
  ]);

  // State for the input text box
  const [input, setInput] = useState("");

  // State to show loading status when waiting for AI response
  const [loading, setLoading] = useState(false);

  // Toggles chatbot visibility
  const toggleChat = () => setIsOpen(!isOpen);

  // Sends user message to OpenAI and receives a styled outfit recommendation
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to messages
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Format wardrobe items into a readable list for the AI
    const wardrobeSummary = items
      .map(
        (item) =>
          `• ${item.name} (${item.category}) - color: ${item.color}, occasion: ${item.occasion}, season: ${item.season}`
      )
      .join("\n");

    // System prompt to guide the AI's response
    const systemPrompt = {
      role: "system",
      content: `You are a fashion assistant. The user owns the following wardrobe:\n${wardrobeSummary}\n\nBased on the user's message, suggest a complete outfit using appropriate items. Include a top, bottom, and footwear at minimum. Be clear and helpful.`,
    };

    try {
      // Call OpenAI's chat completion API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [systemPrompt, ...newMessages], // Include system and user messages
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate an outfit.";

      // Add AI reply to the messages
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      // Handle any errors
      console.error("Chatbot error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ API error or quota exceeded. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Sends message when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Button to open/close chatbot */}
      <button
        onClick={toggleChat}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
      >
        {isOpen ? "✖ Close Chat" : "💬 Chat"}
      </button>

      {/* Chatbox container */}
      {isOpen && (
        <div className="mt-2 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="p-3 font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
            AI Assistant
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  msg.role === "user"
                    ? "bg-blue-100 dark:bg-blue-700 text-right ml-auto"
                    : "bg-gray-200 dark:bg-gray-700 mr-auto"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {/* Loading indicator */}
            {loading && <div className="text-xs text-gray-500">Typing...</div>}
          </div>

          {/* Input field */}
          <div className="p-2 border-t dark:border-gray-600">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me to make you an outfit..."
              className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
