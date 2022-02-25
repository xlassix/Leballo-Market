import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MarketNfts from "../components/MarkerNfts";
import Intro from "../components/Intro";
import Spec from "../components/Spec";
import Web3Modal from "web3modal";
import dynamic from "next/dynamic";
import { Context } from "../components/Context";
import { useState, useEffect, useContext } from "react";

export default function Home() {
  const Modal = dynamic(() => import("../components/Modal"));
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

  const { address, errorInstance, setErrorInstance, setAddress } =
    useContext(Context).state;

  async function connect() {
    try {
      const web3Model = new Web3Modal({
        providerOptions,
      });
      const connection = await web3Model.connect();
      await setAddress(connection.selectedAddress);
    } catch (e) {
      setErrorInstance({ ...errorInstance, status: true, message: e.message });
    }
  }

  useEffect(async () => {
    await connect();
  }, [errorInstance.count]);

  return (
    <>
      <Nav />
      <Intro />
      <Spec />
      {errorInstance.status | !address ? (
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
              {errorInstance.message ? errorInstance.message : "Disconnected"}
            </h5>
            {console.log(errorInstance)}
            <p style={{ textAlign: "center" }}>
              {errorInstance.subtitle
                ? errorInstance.subtitle.split("'")[1]
                : "kindly Install MetaMask and Verify you on the Polygon Network(TestNet)"}
            </p>
          </div>
        </Modal>
      ) : null}
      <MarketNfts />
      <Footer></Footer>
    </>
  );
}
