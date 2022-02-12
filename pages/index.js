import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MarketNfts from "../components/MarkerNfts";
// import Modal from "../components/Modal";
import Intro from "../components/Intro";
import Spec from "../components/Spec";
import Web3Modal from "web3modal";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Modal =dynamic(()=> import("../components/Modal"))

export default function Home() {
  const providerOptions = {
    connect: {
      package: { mustBeMetaMask: false, silent: false, timeout: 100 },
      options: {
        rpc: {
          137: "https://rpc-mumbai.matic.today",
        },
        network: "matic",
      },
    },
  };

  const [_connection, setConnection] = useState(null);
  const [errorInstance, setErrorInstance] = useState({
    status: false,
    message: "",
    count: 0,
  });
  async function connect() {
    try {
      const web3Model = new Web3Modal({
        providerOptions,
      });
      const _connect = await web3Model.connect();
      setConnection(_connect);
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
      <Nav connection={_connection} />
      <Intro />
      <Spec />
      {errorInstance.status | _connection  ? (
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
      <MarketNfts connection={_connection} />
      <Footer></Footer>
    </>
  );
}
