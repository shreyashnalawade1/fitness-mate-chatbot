import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export default function App() {
    return (
      <BrowserRouter >
        <Routes>
        <Route path="/chat" element={<Chat/>}></Route>
        <Route path="/" element={<Home/>}></Route>  
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
  )
}



