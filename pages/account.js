import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Profile from "../components/profile";
import dynamic from "next/dynamic";
import "../styles/upload.module.css";
import MyNfts from "../components/MyNfts";
import { useContext,useEffect,useState } from "react";
import { Context } from "../components/Context";
import Web3Modal from "web3modal";

export default function AccountPage() {
  const Modal = dynamic(() => import("../components/Modal"));
  const { address, errorInstance, setErrorInstance, setAddress } =
    useContext(Context).state;
    async function connect(){
      try{
      const web3Model = new Web3Modal();
      var connection=await web3Model.connect()
      await setAddress(connection.selectedAddress);
      }catch(e){
        setErrorInstance({ ...errorInstance, status: true, message: e.message });
      }
    }
  useEffect(
    async()=>{
      await connect()
    },[errorInstance.count]
  );
  return (
    <>
      <Nav isAdmin={true} />
      <div className="bg-dark">
        <Profile></Profile>
        <MyNfts />
        <Footer></Footer>
        {errorInstance.status || !address ? (
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
              <p style={{ textAlign: "center" }}>
                kindly Install Metabase and Verify you on the Polygon
                Network(TestNet)
              </p>
            </div>
          </Modal>
        ) : null}
      </div>
    </>
  );
}
