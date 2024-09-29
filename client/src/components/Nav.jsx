import {ModeToggle} from '@/components/ModeToggle'
import {MessageCircle, UsersRound, Phone, Settings} from 'lucide-react'
import Logo from '/logo.png'
import {useEffect, useState} from 'react'

const Nav = ({Select, setSelect}) => {
  const User = localStorage.getItem('User')
  const [ParsedUser, setParsedUser] = useState(false);
  const [shortedName, setShortedName] = useState(false)
  useEffect(() => {
    if(User){
      setParsedUser(JSON.parse(User))
      const ParsedUserLocal = JSON.parse(User)
      let Break = ParsedUserLocal.Name.split(' ', 2)
      if(Break.length > 1) {
        setShortedName(Break[0][0] + Break[1][0])
      } else {
        setShortedName(Break[0][0])
      }
    }
  }, [User])

  return (
    <div className="bg-secondary relative text-secondary-foreground py-5 w-[6rem] h-screen flex flex-col items-center">
      <div className="top flex flex-col gap-5">
        <div style={{backgroundColor: 'rgb(175, 187, 247, 0.3)' }} className="logo relative w-[3.2em] h-[3.2em] rounded-[12px] flex items-center justify-center">
          <img src={Logo} className="absolute text-blue-500 opacity-[0.7] w-[2.2em] h-[2.2em]"/>
        </div>
         <div onClick={()=> setSelect('Chats')} className={`w-[3em] h-[3em] ${Select == 'Chats' && 'bg-[#0262c8]'} cursor-pointer hover:bg-[#0262c8] mx-auto rounded-[10px] flex items-center justify-center `}>
            <MessageCircle />
         </div>
         <div onClick={()=> setSelect('People')} className={`w-[3em] h-[3em] ${Select == 'People' && 'bg-[#0262c8]'} cursor-pointer hover:bg-[#0262c8] mx-auto rounded-[10px] flex items-center justify-center `}>
            <UsersRound />
         </div>
         <div onClick={()=> setSelect('Call')} className={`w-[3em] h-[3em] ${Select == 'Call' && 'bg-[#0262c8]'} cursor-pointer hover:bg-[#0262c8] mx-auto mb-3 rounded-[10px] flex items-center justify-center `}>
            <Phone />
         </div>
         <div onClick={()=> setSelect('Settings')} id="Settings" className={`w-[3em] h-[5em] ${Select == 'Settings' && 'text-[#0262c8]'} cursor-pointer mx-auto flex items-center justify-center`}>
            <Settings />
         </div>
      </div>
      <div className="bottom absolute bottom-0 py-[2rem] w-full flex flex-col items-center">
        <ModeToggle/>
        <div style={{backgroundColor: ParsedUser.Color}} className={`cursor-pointer rounded-full w-[44px] h-[44px] flex items-center justify-center font-semibold mt-5`}>{shortedName ? shortedName : ''}</div>
      </div>
    </div>
  );
};

export default Nav;