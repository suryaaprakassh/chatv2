import axios from "axios";
import Register from "./Resgister";
function App() {
  axios.defaults.withCredentials = true;
  return (
    <div>
      <Register />
    </div>
  );
}

export default App;
