import { createContext, useState } from "react";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { nftAddress, nftMarketPlaceAddress } from "../config";
import { create as ipfs_client } from "ipfs-http-client";

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
  const [currentNft, setCurrentNft] = useState(null);
  const [_web3modal, setMyWeb3modal] = useState(null);
  const [errorInstance, setErrorInstance] = useState({
    status: false,
    message: "",
    subtile: "",
    count: 0,
  });

  const initialState = {
    address,
    setAddress,
    client,
    nftAddress,
    Market,
    NFT,
    nftMarketPlaceAddress,
    errorInstance,
    setErrorInstance,
    setMyWeb3modal,
    currentNft,
    setCurrentNft,
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
