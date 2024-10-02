import { Bolt } from 'lucide-react'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {LoaderCircle} from 'lucide-react'
import { io } from 'socket.io-client';
import ChatBoard from './ChatBoard'

const Chats = () => {
  const [Friends, setFriends] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('User'));
  const serverUrl = import.meta.env.VITE_SERVER_URL
  const [Loading ,setLoading] = useState(true)
  const [RandomColors, setRandomColors] = useState([])
  const [Search, setSearch] = useState(false);
  const [FilteredFriends, setFilteredFriends] = useState([]);
  const socket = io(`${serverUrl}`); // Replace with your backend URL
  const [RoomId, setRoomId] = useState(false);
  const [ChatLoader, setChatLoader] = useState(false);
  const [FriendName, setFriendName] = useState(false);

  const colors = [
  'rgba(255, 87, 51, 0.6)',   // Red
  'rgba(51, 255, 87, 0.6)',   // Green
  'rgba(51, 87, 255, 0.6)',   // Blue
  'rgba(255, 51, 165, 0.6)',  // Pink
  'rgba(255, 184, 51, 0.6)',  // Orange
  'rgba(51, 255, 243, 0.6)',  // Cyan
  'rgba(141, 51, 255, 0.6)',  // Purple
  'rgba(51, 255, 181, 0.6)',  // Light Green
  'rgba(255, 51, 51, 0.6)',   // Bright Red
  'rgba(255, 195, 0, 0.6)'    // Yellow
  ];

  useEffect(()=>{
    const generateRandomColors = (num) => {
      const randomColorsArray = [];
      for (let i = 0; i < num; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        randomColorsArray.push(randomColor);
      }
      setRandomColors(randomColorsArray);
    };

    const getFriends = async () =>{
      try {
        const response = await axios.post(`${serverUrl}/getFriends`, {OfFriends: currentUser.Name})
        if(response) {
          setFriends(response.data)
          setFilteredFriends(response.data)
          setLoading(false)
          generateRandomColors(response.data.length);
        }
      } catch(error) {
        console.log(error);
      }
    } 
    getFriends()
  },[])

  useEffect(()=> {
     if(Search) {
      const filtered = Friends.filter(friend =>
        friend.toLowerCase().includes(Search.toLowerCase())
      );
      setFilteredFriends(filtered);
      } else {
        setFilteredFriends(Friends)
      }
  },[Search])


  useEffect(()=>{
    if(RoomId, FriendName) {
      socket.emit('createRoom', {RoomId, FriendName})
    }
  }, [RoomId])


  socket.on('myRoom', function(data) {
    setChatLoader(false)
  });


  return (
    <div id="chats-container" className="flex w-full relative">

     <div id="chats" className="relative w-[27em] p-6 h-full bg-background">
       <div id="description" className="w-full pb-6 flex flex-col items-center gap-5">
         <div id="text" className="w-full flex justify-between items-center">
           <h1 className="text-[1.4em] font-medium ">Chats</h1>
           <Bolt className="cursor-pointer" />
         </div>
         <input onChange={(e)=> setSearch(e.target.value)} placeholder="Search.." id="search" className="h-10 w-full rounded-full bg-secondary px-5"></input>
       </div>    
       <p className="text-zinc-300 mt-4">Friends</p>

       <div id="friends" className="mt-[1em] flex flex-col h-full ">
       {
        Loading ?
         <LoaderCircle className="w-6 h-6  animate-spin m-auto" /> 
         :
        FilteredFriends.map((friend, index)=> (
         <div onClick={()=> {setRoomId([currentUser.Name, friend].sort().join('_')); setChatLoader(true); setFriendName(friend)}} key={index} id="friend" className="cursor-pointer hover:bg-secondary2 bg-secondary w-full h-[fit-content] mb-5 p-3 rounded-[12px]">
           <div className="w-full relative flex gap-5 py-1 items-center">
              <div style={{backgroundColor: RandomColors[index]}} className="w-[35px] h-[35px] rounded-full flex items-center justify-center font-semibold">{friend[0]}</div>
              <div>
                <h2>{friend}</h2>
                <p className="text-sm">Yo wassup bro!</p>
              </div>
              <p className="absolute top-0 right-0 text-sm">10:42</p>
           </div>
         </div>
         ))
        }
       </div>
     </div>

    <div className="w-full h-full bg-secondary relative">
      {

        ChatLoader ? <LoaderCircle className="w-6 h-6 animate-spin absolute top-1/2 left-1/2"/>
        : 
        <ChatBoard RoomId = {RoomId} FriendName={FriendName} RandomColors={RandomColors} FilteredFriends={FilteredFriends}  />
      }
    </div>
    </div>
  );
};

export default Chats;
