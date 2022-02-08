import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MarketNfts from "../components/MarkerNfts";
import dynamic from "next/dynamic";
import Intro from "../components/Intro";
import Spec from "../components/Spec";
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";

export default function Home() {
  const [connection, setConnection] = useState(null);
  async function connect() {
    try {
      const web3Model = new Web3Modal();
      const _connection = await web3Model.connect();
      setConnection(_connection);
      console.log({ _connection, address: _connection.selectedAddress });
      return connect;
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(async () => {
    await connect();
  }, [connection]);

  return (
    <>
      <Nav connection={connection} />
      <Intro />
      <Spec />
      <MarketNfts connection={connection} />
      <Footer></Footer>
    </>
  );
}
