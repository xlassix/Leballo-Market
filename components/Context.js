import { createContext, useState,useEffect } from "react";
import Market from "../artifacts/contracts/MusicMarket.sol/MusicMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { create as ipfs_client } from "ipfs-http-client";
import { nftAddress, nftMarketPlaceAddress } from "../config"
import { getOwner } from "../utils/helper";

//initialize IPFS client
const client = ipfs_client({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `${process.env.projectId}:`,
  },
});

//Initialize CreateContext
let Context = createContext();
function Provider(props) {
  //State Defination
  const [address, setAddress] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [currentNft, setCurrentNft] = useState(null);
  const [_web3modal, setMyWeb3modal] = useState(null);
  const [errorInstance, setErrorInstance] = useState({
    status: false,
    message: "",
    subTitle: "",
    count: 0,
  });
  useEffect(async()=>{
    setOwnerAddress(await(getOwner()))
  },[])

  const initialState = {
    address,
    setAddress,
    client,
    Market,
    NFT,
    errorInstance,
    setErrorInstance,
    currentNft,
    setCurrentNft,
    nftAddress, 
    nftMarketPlaceAddress,
    ownerAddress
  };

  return (
    <Context.Provider
      value={{
        state: initialState,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

const Consumer = Context.Consumer;
export { Provider, Consumer, Context };
