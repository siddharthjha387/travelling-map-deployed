import "./register.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef, useState } from "react";
import axios from "axios";
export default function Register({setViewRegister}) {

    const [success,setSuccess]=useState(false);
    const [failure,setFailure]=useState(false);

    const nameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        const newUser={
            username:nameRef.current.value,
            password:passwordRef.current.value,
            email:emailRef.current.value,
        };

        console.log(newUser);
        try{
            const res=await axios.post("/api/users/register",newUser);
            setFailure(false);
            setSuccess(true);
        }
        catch(err)
        {
            
            console.log(err);
            setFailure(true);
            setSuccess(false);
        }
    }
  return (
    
    <div className="registerContainer">
        <div className="logo">
        <LocationOnIcon/>Travelling Map

        </div>
        <form onSubmit = {handleSubmit}>
            <input type="text" name="username"  placeholder="Username" ref={nameRef}/>
            <input type="email" name="email"  placeholder="Email" ref={emailRef}/>
            <input type="password" name="password"  placeholder="Password" ref={passwordRef}/>
            <button className="registerbtn" type = 'submit' >Register</button>
            
        </form>
        { success && (<span className="success">Successful. Please Login</span>)}
            {failure && (<span className="failure">Register Again</span>)}
            <CancelIcon className="registerCancel" onClick={()=>setViewRegister(false)} />
    </div>
      
    
  )
}
