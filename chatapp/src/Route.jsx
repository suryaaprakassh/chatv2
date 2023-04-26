import { useContext } from "react"
import { userContext } from "./App"

const Route=()=>{
    const {username}=useContext(userContext)
    return(
        <h2>Hello mf ! {username} you are logged in...</h2>
    )
}

export default Route