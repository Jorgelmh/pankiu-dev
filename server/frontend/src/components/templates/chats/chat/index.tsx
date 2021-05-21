import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Chat,
  ChatMessageSendEvent,
  Message,
} from "@progress/kendo-react-conversational-ui";

const user = {
  id: 1,
  avatarUrl: "https://via.placeholder.com/24/008000/008000.png",
};

const bot = { id: 0 };

const initialMessages: Array<Message> = [
  {
    author: bot,
    suggestedActions: [
      {
        type: "reply",
        value: "Oh, really?",
      },
      {
        type: "reply",
        value: "Thanks, but this is boring.",
      },
    ],
    timestamp: new Date(),
    text:
      "Hello, this is a demo bot. I don't do much, but I can count symbols!",
  },
];

const App = () => {
  const [messages, setMessages] = React.useState(initialMessages);

  const addNewMessage = (event: ChatMessageSendEvent) => {
    let botResponse = Object.assign({}, event.message);
    botResponse.text = countReplayLength(event.message.text);
    botResponse.author = bot;
    setMessages([...messages, event.message]);
    setTimeout(() => {
      setMessages((oldMessages) => [...oldMessages, botResponse]);
    }, 1000);
  };

  const countReplayLength = (question: any) => {
    let length = question.length;
    let answer = question + " contains exactly " + length + " symbols.";
    return answer;
  };

  return (
    <div>
      <Chat
        user={user}
        messages={messages}
        onMessageSend={addNewMessage}
        placeholder={"Type a message..."}
        width={400}
      />
    </div>
  );
};

export default App;
