import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Context } from "./Context";

export default function BuySong({ nft }) {
  const {
    Market,
    NFT,
    errorInstance,
    setErrorInstance,
    nftAddress,
    nftMarketPlaceAddress,
  } = useContext(Context).state;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState();

  async function buyNft(e) {
    setLoading(true);
    await _buyNfts();
    setLoading(false);
    toggleData();
  }

  async function _buyNfts() {
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
      const price = ethers.utils.parseUnits(nft.formatted_price, "ether");
      console.log(nft.formatted_price, price, nft.itemId, price.toString());

      var transaction
      if (nft.owner == "0x0000000000000000000000000000000000000000") {
        transaction = await contract.createSongSale(
          nftAddress,
          nft.itemId.toNumber(),
          {
            value: price.toString(),
          }
        );
      }else{
        transaction = await contract.BuySong(
            nftAddress,
            nft.tokenId.toNumber(),
            {
              value: price.toString(),
            }
        );
      }
      console.log(transaction);

      await transaction.wait();
      router.push("/account");
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subTitle: e.data?e.data.message:"",
      });
    }
  }

  function toggleData() {
    setModal(!showModal);
  }
  return (
    <>
      <a onClick={toggleData} className="rounded-button btn-grad">
        buy now
      </a>
      {showModal ? (
        <Modal>
          <a
            onClick={() => toggleData()}
            style={{ fontSize: "2rem", textAlign: "right" }}
          >
            &times;
          </a>
          {!loading ? (
            <form className="upload">
              <div className="center">
                <a className="rounded-button" type="button" onClick={buyNft}>
                  Buy Nft
                </a>
              </div>
            </form>
          ) : (
            <p style={{ textAlign: "center", padding: "7rem" }}>
              Processing....
            </p>
          )}
        </Modal>
      ) : null}
    </>
  );
}
