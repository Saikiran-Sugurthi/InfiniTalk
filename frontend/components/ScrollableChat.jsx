import ScrollToBottom from 'react-scroll-to-bottom';
import { Avatar, Tooltip } from '@mui/material';
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from '../src/config/ChatLogics';
import { ChatState } from '../src/context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

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
                    m.sender?._id === user?._id ? '#BEE3F8' : '#B9F5D0'
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
    </ScrollToBottom>
  );
};

export default ScrollableChat;
