import { useState, useEffect } from "react";

type message = {
  from: string;
  message: string;
  id: number;
};

type result = {
  title: string;
  price: number;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<message[]>([]);
  const [chatInput, setChatInput] = useState("");

  const search = (searchTerm: string): result[] => {
    const axios = require("axios");

    // set up the request parameters
    const params = {
      api_key: "2B2289C1CC6E46D6A0630D47384569F5",
      type: "search",
      amazon_domain: "amazon.com",
      search_term: searchTerm,
    };

    // make the http GET request to Rainforest API
    axios
      .get("https://api.rainforestapi.com/request", { params })
      .then((response: any) => {
        const search_results = response.data.search_results;
        const res = search_results.map((result: any) => {
          return {
            title: result?.title || "not found",
            price: result?.price?.value || "not found",
          };
        });
        const topten = res.slice(0, 10);
        let msgs = topten.map((result: any) => {
          const msg = {
            from: "bot",
            message: `${result.title} for ${result.price}$`,
            id: messages.length + 1 + Math.random() * 12,
          };

          return msg;
        });
        let temp = [...messages, ...msgs];
        console.log(temp);
        setMessages(temp);
      })
      .catch((error: any) => {
        // catch and print the error
        console.log(error);
      });
    return [];
  };

  const sendMessage = () => {
    console.log(chatInput);
    const msg = {
      from: "user",
      message: chatInput,
      id: messages.length + 1,
    };
    const temp = [...messages];
    temp.push(msg);
    setMessages(temp);

    if (chatInput.includes("I wanna search for")) {
      const searchTerm = chatInput
        .toLowerCase()
        .split("i wanna search for ")[1];
      search(searchTerm);
    }
  };

  useEffect(() => {
    const initial = {
      from: "bot",
      message: "Hello how can i help you today?",
      id: messages.length + 1,
    };
    if (messages.length === 0) {
      const temp = [...messages];
      temp.push(initial);
      setMessages(temp);
    }
  }, []);

  return (
    <>
      <div className="chat">
        {messages.map((message) => {
          return (
            <div className="message" key={message.id}>
              {message.message}
            </div>
          );
        })}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message"
          id="chat-input"
          value={chatInput}
          onChange={(e) => {
            setChatInput(e.target.value);
          }}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </>
  );
};

export default ChatBot;
