import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {SmilePlus, Send} from 'lucide-react'
import EmojiPicker from './EmojiPicker';

const ChatBoard = ({ RoomId, FriendName, RandomColors, FilteredFriends }) => {
  const [Input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [socket, setSocket] = useState(null);
  const ChatBoardMessages = useRef(null);
  const [Emoji, setEmoji] = useState(false);
  
  var friendIndex = false; 
  if (FriendName) {
    friendIndex = FilteredFriends.indexOf(FriendName);
  }

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // Join the room after connecting
      newSocket.emit('createRoom', { RoomId, FriendName });
    });

    newSocket.on('msgincomming', (data) => {
      console.log('Incoming message received:', data);
        let newIncomming = {
          text: data,
          type: 'incomming'
        };
        setMessages((prevMsgs) => [...prevMsgs, newIncomming]);
        setTimeout(() => {
          ChatBoardMessages.current.scrollTop = ChatBoardMessages.current.scrollHeight;
        }, 0);
    });

    return () => {
      newSocket.disconnect();  // Clean up the socket connection on unmount
    };
  }, [RoomId, FriendName, serverUrl]); // Add RoomId and FriendName to the dependency array

  function handleAddOutgoing() {
    setEmoji(false)
    if (Input.trim() !== '') {
      let newOutgoing = {
        text: Input,
        type: 'outgoing'
      };

      socket.emit('msgpush', Input); // Send the message

      setMessages((prevMsgs) => [...prevMsgs, newOutgoing]);
      setInput('');
      setTimeout(() => {
        ChatBoardMessages.current.scrollTop = ChatBoardMessages.current.scrollHeight;
      }, 0);
   }
  }

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleAddOutgoing();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [Input]);

  function HandleEmojiToggle () {
    if(Emoji){
      setEmoji(false)
    } else {
      setEmoji(true)
    }
  }

  return (
    <>
      {FriendName ? (
        <>
          <div className="w-full h-[70px] p-5  border-opacity-10 dark:border-opacity-50 border-b-[4px] border-zinc-900 flex gap-3 items-center">
            <div style={{ backgroundColor: RandomColors[friendIndex] }} className="w-[44px] h-[44px] rounded-full flex items-center justify-center font-semibold">{FriendName[0]}</div>
            <h1 className="font-semibold">{FriendName}</h1>
          </div>

          <div ref={ChatBoardMessages}  id="messages" className="w-full h-[81vh] p-5 relative overflow-y-scroll">
            {messages.map((message, index) => (
              <div key={index} className="w-full relative h-[fit-content]">
                <div className={`${message.type === 'outgoing' ? 'bg-primary ml-auto text-primary-foreground ' : 'bg-background mr-auto'} relative px-4 break-words rounded-[16px] border-[2px] p-2 font-medium w-[fit-content] mt-3 max-w-[400px] text-wrap text-[1.1em]`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <EmojiPicker setInput={setInput} Input={Input} Emoji={Emoji}/>

          <div id="input" className="w-full h-[72px] absolute bottom-0 px-5 py-3 flex">
            <div className="inputBox relative w-full h-full flex">
              <input value={Input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Write a message.." className="border-none pr-14 outline-none w-full h-full bg-secondary2 rounded-tr-[12px] rounded-tl-[12px] px-4" />
              <SmilePlus onClick={HandleEmojiToggle} className="cursor-pointer opacity-[0.7] top-1/2 w-7 h-7 center-y mr-4 absolute right-0" />
            </div>
            <Button onClick={handleAddOutgoing} variant="primary" className="h-full ml-5 w-[fit-content]">
              <Send />
            </Button>
          </div>
        </>
      ) : (
        <p className="absolute center">Please select a Chat</p>
      )}
    </>
  );
};

export default ChatBoard;
