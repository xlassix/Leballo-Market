import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import axios from "axios";
import MyNftCard from "./MyNftCard";
import { Context } from "./Context";
import Web3Modal from "web3modal";

export default function MyNfts() {
  const {
    client,
    nftAddress,
    Market,
    NFT,
    nftMarketPlaceAddress,
    errorInstance,
    setErrorInstance,
    setAddress,
    ownerAddress,
    address,
  } = useContext(Context).state;
  const nftPerPage = 20;
  const [showModal, setModal] = useState();
  const [page, setPage] = useState(1);
  function toggleData() {
    setModal(!showModal);
  }
  const router = useRouter();
  const [nfts, setNfts] = useState({ purchased: [], listed: [], Active: [] });
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    loadNfts();
  }, [address]);

  async function loadNfts() {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        nftMarketPlaceAddress,
        Market.abi,
        signer
      );

      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);

      var [data, minted] = ([], []);
      if (address === ownerAddress) {
        [data, minted] = await Promise.all([
          contract.fetchMyMusicNFTs(nftPerPage * page),
          contract.getLastMinted(nftPerPage * page),
        ]);
      } else {
        [data, minted] = await Promise.all([
          contract.fetchMyMusicNFTs(nftPerPage * page),
          [],
        ]);
      }

      console.log(data, minted);

      const items = await Promise.all([
        ...data.map(async (elem) => {
          const tokenURI = await tokenContract.tokenURI(elem.tokenId);
          const meta = await axios.get(tokenURI);
          console.log(tokenURI, meta);
          let price = ethers.utils.formatUnits(elem.price.toString(), "ether");

          return {
            price,
            tokenId: elem.tokenId.toNumber(),
            id: elem.itemId.toNumber(),
            seller: elem.seller,
            owner: elem.owner,
            image: meta.data.image,
            name: meta.data.name,
            status: elem.status == 0 ? "listed" : "Purchased",
            description: meta.data.description,
          };
        }),
        ...minted.map(async (elem) => {
          const tokenURI = await tokenContract.tokenURI(elem.tokenId);
          const meta = await axios.get(tokenURI);
          console.log(tokenURI, meta);
          let price = ethers.utils.formatUnits(elem.price.toString(), "ether");

          return {
            price,
            tokenId: elem.tokenId.toNumber(),
            id: elem.itemId.toNumber(),
            seller: elem.seller,
            owner: elem.owner,
            image: meta.data.image,
            name: meta.data.name,
            status: "Active",
            description: meta.data.description,
          };
        }),
      ]);
      console.log("items", items);
      setNfts({
        purchased: items.filter((elem) => elem.status === "Purchased"),
        listed: items.filter((elem) => elem.status === "listed"),
        Active: items.filter((elem) => elem.status === "Active"),
      });
      setLoaded(true);
    } catch (e) {
      console.log("qeqe", e.message);
    }
  }

  async function listNft(nft, sell_price) {
    const web3Model = new Web3Modal();
    const connection = await web3Model.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftMarketPlaceAddress,
      Market.abi,
      signer
    );
    //list Nfts on Market place
    let listingPrice = await contract.listingPrice();
    const price = ethers.utils.parseUnits(sell_price, "ether");
    console.log(nftAddress, nft.tokenId, price.toString());
    const transaction = await contract.listItem(
      nftAddress,
      nft.id,
      price.toString(),
      {
        value: listingPrice.toString(),
      }
    );
    let tx = await transaction.wait();
    tx.events[0]["transactionHash"];
    router.push("/");
  }

  async function cancelListing(nft) {
    const web3Model = new Web3Modal();
    const connection = await web3Model.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftMarketPlaceAddress,
      Market.abi,
      signer
    );
    const transaction = await contract.CancelItem(nftAddress, nft.id);
    let tx = await transaction.wait();
    tx.events[0]["transactionHash"];
    router.push(`/song/${nft.id}`);
  }

  return (
    <>
      {address === ownerAddress ? (
        <>
          <section>
            <h4>Active ({nfts["Active"].length})</h4>
            <>
              {nfts["Active"].length === 0 && loaded === true ? (
                <p style={{ textAlign: "center", padding: "7rem 0" }}>
                  No Available Nfts
                </p>
              ) : (
                <div className="my-nfts">
                  {nfts["Active"].map((nft, i) => {
                    return (
                      <MyNftCard
                        nft={nft}
                        key={"Active" + i}
                        redirect={()=>router.push(`/song/${nft.id}`)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          </section>
        </>
      ) : null}
      <section>
        <h4>Purchased ({nfts["purchased"].length})</h4>
        <>
          {nfts["purchased"].length === 0 && loaded === true ? (
            <p style={{ textAlign: "center", padding: "7rem 0" }}>
              No Available Nfts
            </p>
          ) : (
            <div className="my-nfts">
              {nfts["purchased"].map((nft, i) => {
                return (
                  <MyNftCard
                    nft={nft}
                    key={i}
                    admin={address === ownerAddress}
                    cancel={nft.status === "Purchased"}
                    onClickFunc={async (e) => {
                      if (nft.status === "Purchased") {
                        await listNft(nft, e);
                      } else {
                        await cancelListing(nft);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </>
      </section>
      <section>
        <h4>listed ({nfts["listed"].length})</h4>
        <>
          {nfts["listed"].length === 0 && loaded === true ? (
            <p style={{ textAlign: "center", padding: "7rem 0" }}>
              No Available Nfts
            </p>
          ) : (
            <div className="my-nfts">
              {nfts["listed"].map((nft, i) => {
                return (
                  <MyNftCard
                    nft={nft}
                    key={i}
                    cancel={nft.status === "Purchased"}
                    onClickFunc={async (e) => {
                      if (nft.status === "Purchased") {
                        await listNft(nft, e);
                      } else {
                        await cancelListing(nft);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </>
      </section>
    </>
  );
}
