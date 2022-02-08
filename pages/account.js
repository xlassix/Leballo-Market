import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Profile from "../components/profile";
import "../styles/upload.module.css"
import MyNfts from "../components/MyNfts";
import { useState,useEffect } from "react";
import Web3Modal from "web3modal";

export default function AccountPage() {
  const [connection, setConnection] = useState(null);
  async function connect() {
    const web3Model = new Web3Modal();
    const _connection= await web3Model.connect();
    setConnection(_connection)
    console.log({_connection,address:_connection.selectedAddress});
    return connect
  }

  useEffect(
    async()=>{
      await connect()
    },[connection]
  )
  return (
    <>
      <Nav isAdmin={true} connection={connection}/>
      <div className="bg-dark">
        <Profile></Profile>
        <MyNfts />
        <Footer></Footer>
      </div>
    </>
  );
}
