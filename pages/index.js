import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MarketNfts from "../components/MarkerNfts";
import dynamic from "next/dynamic";
// import Modal from "../components/Modal";
import Intro from "../components/Intro";
import Spec from "../components/Spec";
import Web3Modal from "web3modal";
import { useState, useLayoutEffect, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export default function Home() {
  const Modal = dynamic(() => import("../components/Modal"));
  const providerOptions = {
    connect: {
      package: { mustBeMetaMask: true, silent: false, timeout: 100 },
      options: {
        rpc: {
          137: "https://rpc-mumbai.matic.today",
        },
        network: "matic",
      },
    },
  };

  const [connection, setConnection] = useState(null);
  const [errorInstance, setErrorInstance] = useState({
    status: false,
    message: "",
    count: 0,
  });
  async function connect() {
    try {
      const web3Model = new Web3Modal({
        providerOptions, // required
      });
      const _connection = await web3Model.connect();
      setConnection(_connection);
      return connect;
    } catch (e) {
      setErrorInstance({ ...errorInstance, status: true, message: e.message });
    }
  }

  useEffect(async () => {
    await connect();
  }, [errorInstance.count]);
  return (
    <>
      <Nav connection={connection} />
      <Intro />
      <Spec />
      <MarketNfts connection={connection} />
      {errorInstance.status || connection == null ? (
        <Modal>
          <div className="upload">
            <a
              onClick={() => {
                setErrorInstance({
                  ...errorInstance,
                  status: false,
                  count: errorInstance.count + 1,
                });
              }}
              style={{ fontSize: "2rem", textAlign: "right" }}
            >
              &times;
            </a>
            <h5 style={{ textAlign: "center", padding: "7rem" }}>
              {errorInstance.message?errorInstance.message:"Disconnected"}
            </h5>
            <p style={{ textAlign: "center" }}>
              kindly Install Metabase and Verify you on the Polygon
              Network(TestNet)
            </p>
          </div>
        </Modal>
      ) : null}
      <Footer></Footer>
    </>
  );
}
