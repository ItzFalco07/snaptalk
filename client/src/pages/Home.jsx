import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/Nav";
import { useState } from "react";
import Chats from "@/components/Chats";
import People from "@/components/People";
import Call from "@/components/Call";
import Settings from "@/components/Settings";
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react'

function App() {
  const Navigate = useNavigate()
  const [Select, setSelect] = useState("Chats");
  const User = localStorage.getItem('User')
  useEffect(()=> {
  if(!User) {
    Navigate('/')
  }
}, [])

  return (
    <>      
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> 
      <div id="container" className="flex">
        <Nav Select={Select} setSelect={setSelect} />
        {Select === "Chats" && <Chats />}
        {Select === "People" && <People />}
        {Select === "Call" && <Call />}
        {Select === "Settings" && <Settings />}
      </div>
      </ThemeProvider>
    </>
  );
}

export default App;
