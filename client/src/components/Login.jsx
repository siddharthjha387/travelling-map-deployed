import "./login.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef, useState } from "react";
import axios from "axios";
export default function Login({setViewLogin,myStorage,setCurrentUser}) {

    
    const [failure,setFailure]=useState(false);

    const nameRef=useRef();
    const passwordRef=useRef();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        const user={
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };

        console.log(user);
        try{
            const res=await axios.post("/api/users/login",user);
            console.log(res);
            console.log(res.data.username);
            
            myStorage.setItem("user",res.data.username)
            setCurrentUser(res.data.username)
            setFailure(false);
            setViewLogin(false);
        }
        catch(err)
        {
            console.log(err);
            setFailure(true);
        }
    }
  return (
    
    <div className="loginContainer">
        <div className="logo">
        <LocationOnIcon/>Travelling Map

        </div>
        <form onSubmit = {handleSubmit}>
            <input type="text" name="username"  placeholder="Username" ref={nameRef}/>
            <input type="password" name="password"  placeholder="Password" ref={passwordRef} autocomplete="current-password"/>
            <button className="loginbtn" type = 'submit' >Login</button>
            
        </form>
 
            {failure && (<span className="failure">Login Again</span>)}
            <CancelIcon className="loginCancel" onClick={()=>setViewLogin(false)} />
    </div>
      
    
  )
}
