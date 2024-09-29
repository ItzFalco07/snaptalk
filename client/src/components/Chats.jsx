import ChatBoard from './ChatBoard'
import { Bolt } from 'lucide-react'

const Chats = () => {
  return (
    <div id="chats-container" className="flex w-full relative">

     <div id="chats" className="relative w-[27em] p-6 h-full bg-background">
       <div id="description" className="w-full pb-6 flex flex-col items-center gap-5">
         <div id="text" className="w-full flex justify-between items-center">
           <h1 className="text-[1.4em] font-medium ">Chats</h1>
           <Bolt className="cursor-pointer" />
         </div>
         <input placeholder="Search.." id="search" className="h-10 w-full rounded-full bg-secondary px-5"></input>
       </div>    
       <p className="text-zinc-300 mt-4">Friends</p>

       <div id="friends" className="mt-[1em] flex flex-col h-full ">
         <div id="friend" className="cursor-pointer hover:bg-secondary2 bg-secondary w-full h-[fit-content] mb-5 p-3 rounded-[12px]">
           <div className="w-full relative flex gap-5 py-1 items-center">
              <img className="w-[35px] h-[35px] rounded-full"/>
              <div>
                <h2>John</h2>
                <p className="text-sm">Yo wassup bro!</p>
              </div>
              <p className="absolute top-0 right-0 text-sm">10:42</p>
           </div>
         </div>
       </div>
     </div>

     <ChatBoard/>
    </div>
  );
};

export default Chats;
