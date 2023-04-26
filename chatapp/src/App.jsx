import axios from "axios";
import Register from "./Resgister";
import {createContext, useEffect, useState }from "react"
import Route from "./Route";
export const userContext=createContext(null);
function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL="http://localhost:5000"
  const [currentUser,setCurrentUser]=useState("");
  const [currentId,setCurrentId]=useState("");
  useEffect(()=>{
    axios.get("/profile").then(res=>{
      setCurrentId(res.data.userId)
      setCurrentUser(res.data.username)
    }).catch(err=>{
      if(err){
        console.log("not logged int")
      }
    })
  },[currentId,currentUser])
  return (
    <userContext.Provider value={{currentUser,currentId,setCurrentUser,setCurrentId}}>
      {
        currentId!=""?<Route/>:<Register/>
      }
    </userContext.Provider>
  );
}

export default App;
