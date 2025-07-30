import ScrollToBottom from 'react-scroll-to-bottom';
import { Avatar, Tooltip } from '@mui/material';
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from '../src/config/ChatLogics';
import { ChatState } from '../src/context/ChatProvider';
import Lottie from 'react-lottie'

import animationData from "../src/animations/typing.json"
const ScrollableChat = ({ messages,isTyping }) => {
  const { user } = ChatState();

  
  
   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ScrollToBottom className="h-full overflow-y-auto px-4 py-2">
      {messages &&
        messages.map((m, i) =>
          m?.sender ? (
            <div
              key={m._id || i}
              className="flex"
              style={{ alignItems: 'center' }}
            >
              {(isSameSender(messages, m, i, user?._id) ||
                isLastMessage(messages, i, user?._id)) && (
                <Tooltip title={m.sender?.name} placement="bottom-start">
                  <Avatar
                    src={m.sender?.pic}
                    alt={m.sender?.name}
                    sx={{ width: 30, height: 30, marginTop: '7px', marginRight: '8px' }}
                  />
                </Tooltip>
              )}

              <span
                style={{
                  backgroundColor: `${
                    m.sender?._id === user?._id ? '#5865F2' : '#313338'
                  }`,
                   color: `${
                    m.sender?._id === user?._id ? '#FFFFFF' : '#F2F3F5'
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                  marginTop: isSameUser(messages, m, i) ? 3 : 10,
                  borderRadius: '20px',
                  padding: '5px 15px',
                
                  maxWidth: '75%',
                  display: 'inline-block',
                }}
              >
                {m.content}
              </span>
            </div>
          ) : null
        )}
{isTyping && (
  <div className="flex items-center mt-2 ml-3 ">
    <div
      style={{
        backgroundColor: "#1E1F22", // Light gray-blue bubble
        borderRadius: "20px",
        padding: "4px 10px",
        maxWidth: "100px",
        display: "inline-block",
      }}
    >
      <Lottie
        options={defaultOptions}
        height={25}
        width={50}
        style={{
          margin: 0,
        }}
      />
    </div>
  </div>
)}
    </ScrollToBottom>
  );
};

export default ScrollableChat;
