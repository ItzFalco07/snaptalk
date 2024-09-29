import SideImage from '@/components/SideImage'
import FullLogo from '/fullLogo.png'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

const Login = () => {
  const Navigate = useNavigate()
  const [Email, setEmail] = useState(false)
  const [Password, setPassword] = useState(false)

  return (
    <div className="w-screen h-screen bg-black flex p-0 m-0">
    
        <section className="flex flex-1 justify-center items-center flex-col py-10">
           <div className="sm:w-420 w-[64%] flex-center flex-col">
              <img src={FullLogo} className="relative left-[50%] h-20" id="FullLogo"/>
              <h2 className="text-white pt-4 text-2xl font-bold text-center">Log in to your account</h2>
              <p className="text-zinc-500 small-medium md:base-regular mt-2 text-center">Welcome back! Please enter your details.</p>
              <form className="flex flex-col gap-5 w-full mt-4">
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 shad-form_label" htmlFor=":rc:-form-item">Email</label>
                   <input onChange={(e)=> setEmail(e.target.value)} type="text" className="flex h-10 w-full rounded-md text-zinc-100 bg-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shad-input" name="email" id=":rc:-form-item" aria-describedby=":rc:-form-item-description" aria-invalid="false" />
                 </div>

                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 shad-form_label" htmlFor=":rd:-form-item">Password</label>
                   <input onChange={(e)=> setPassword(e.target.value)} type="password" className="flex h-10 w-full rounded-md text-zinc-100 bg-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shad-input" name="password" id=":rd:-form-item" aria-describedby=":rd:-form-item-description" aria-invalid="false" />
                 </div>
                 <button className="text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-blue-900 h-10 px-4 py-2 shad-button_primary" type="submit">Sign Up</button>
                 <p className="text-white text-small-regular text-light-2 text-center mt-2">Dont have an account?<a className="text-primary hover:underline text-small-semibold ml-1 cursor-pointer" onClick={()=> Navigate('/')}>Signup</a></p>
              </form>
           </div>
        </section>
        <SideImage/>
    </div>
  );
};

export default Login;