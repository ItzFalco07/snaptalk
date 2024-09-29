import SideImage from '@/components/SideImage'
import FullLogo from '/fullLogo.png'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button";
import {toast} from 'react-toastify'
import {LoaderCircle} from 'lucide-react'
const Signup = () => {
  const Navigate = useNavigate()
  const [Name, setName] = useState(false)
  const [Email, setEmail] = useState(false)
  const [Password, setPassword] = useState(false)
  const serverUrl = import.meta.env.VITE_SERVER_URL
  const [Loading, setLoading] = useState(false);
  const [RandomColor, setRandomColor] = useState(false);

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

  useEffect(() =>{
      setRandomColor(colors[Math.floor(Math.random()*10)])
  }, [])

  

 const HandleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  if(!Name || !Email || !Password) {
      toast('Enter all details')
      setLoading(false)
    } else {
      try {
        const response = await axios.post(`${serverUrl}/createUser`, {Name, Email, Password, Color: RandomColor});
        console.log(response)
        if(response.data != "error") {
          Navigate('/Home')
          toast("Welcome to Snaptalk!")
          localStorage.setItem('User', JSON.stringify({ Name, Email, Color: RandomColor }))
          setLoading(false)
        } else {
          toast.error("User alredy Exists")
          setLoading(false)
        }
      } catch(error) {
        console.error(error);
        toast.error('User Alredy Exists')
        setLoading(false)
      }  
    }
  }

  return (
    <div className="w-screen h-screen bg-black flex p-0 m-0">
        <section className="flex flex-1 justify-center items-center flex-col py-10">
           <div className="sm:w-420 w-[64%] flex-center flex-col">
              <img src={FullLogo} className="relative left-[50%] h-20" id="FullLogo"/>
              <h2 className="text-white pt-4 text-2xl font-bold text-center">Create a new account</h2>
              <p className="text-zinc-500 small-medium md:base-regular mt-2 text-center">To use snaptalk, Please enter your details</p>
              <form onSubmit={(e)=> HandleSubmit(e)} className="flex flex-col gap-5 w-full mt-4">
                 <div className="space-y-2">
                   <label className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 shad-form_label" htmlFor=":ra:-form-item">Name</label>
                   <input type="text" onChange={(e)=> setName(e.target.value)} className="flex h-10 w-full rounded-md text-zinc-100 bg-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shad-input" name="name" id=":ra:-form-item" aria-describedby=":ra:-form-item-description" aria-invalid="false"/>
                 </div>

                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 shad-form_label" htmlFor=":rc:-form-item">Email</label>
                   <input onChange={(e)=> setEmail(e.target.value)}  type="text" className="flex h-10 w-full rounded-md text-zinc-100 bg-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shad-input" name="email" id=":rc:-form-item" aria-describedby=":rc:-form-item-description" aria-invalid="false" />
                 </div>

                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 shad-form_label" htmlFor=":rd:-form-item">Password</label>
                   <input onChange={(e)=> setPassword(e.target.value)}  type="password" className="flex h-10 w-full rounded-md text-zinc-100 bg-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shad-input" name="password" id=":rd:-form-item" aria-describedby=":rd:-form-item-description" aria-invalid="false" />
                 </div>
                 {Loading ? 
                  <Button disabled className="text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-blue-900 h-10 px-4 py-2 shad-button_primary" type="submit">
                   <LoaderCircle className="animate-spin mr-2 w-4 h-4"/> Loading..
                  </Button>
                  : 
                  <Button className="text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-blue-900 h-10 px-4 py-2 shad-button_primary" type="submit">
                  Signup
                  </Button>
                 }

                 <p className="text-white text-small-regular text-light-2 text-center mt-2">Already have an account?<a className="text-primary hover:underline text-small-semibold ml-1 cursor-pointer" onClick={()=> Navigate('/Login')}>Log in</a></p>
              </form>
           </div>
        </section>
        <SideImage/>
    </div>
  );
};

export default Signup;