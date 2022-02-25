import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Context } from "./Context";
import { getAuctionByItemID } from "../utils/helper";

export default function MakeBid({ auction, itemId }) {
  const [_auction, setAuction] = useState(auction ? auction : {});
  const {
    Auction,
    auctionAddress,
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
  const [price, setPrice] = useState(0);

  async function bidNft(e) {
    e.preventDefault();
    setLoading(true);
    await _bidNfts();
    setLoading(false);
    toggleData();
  }
  useEffect(() => {
    async function feedData() {
      if (itemId) {
        var data = await getAuctionByItemID(itemId);
        setAuction(data);
      }
    }
    feedData();
  }, [itemId]);

  async function _bidNfts() {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(auctionAddress, Auction.abi, signer);

      var transaction = await contract.makeBid(_auction.id.toString(), {
        value: price.toString(),
      });

      console.log(transaction);

      await transaction.wait();
      router.push(`/song/${_auction.tokenId.toString()}`);
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subtitle: e.data ? e.data.message : "",
      });
    }
  }

  async function _endBid() {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(auctionAddress, Auction.abi, signer);

      var transaction = await contract.closeAuction(_auction.id.toString());

      console.log(transaction);

      await transaction.wait();
      router.push("/account");
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subtitle: e.data ? e.data.message : "",
      });
    }
  }

  function toggleData() {
    setModal(!showModal);
  }
  return (
    <>
      {console.log(
        parseInt(_auction.startAt),
        parseInt(_auction.endAt),
        parseInt(new Date().getTime() / 1000),
        parseInt(_auction.endAt) > parseInt(new Date().getTime() / 1000),
        parseInt(_auction.startAt) < parseInt(new Date().getTime() / 1000)
      )}
      {parseInt(_auction.endAt) < parseInt(new Date().getTime() / 1000) &&
      parseInt(_auction.status) == 0 ? (
        <button disabled="" className="rounded-button invented-btn">
          Auction Ended
        </button>
      ) : parseInt(_auction.startAt) < parseInt(new Date().getTime() / 1000) &&
        parseInt(new Date().getTime() / 1000) < parseInt(_auction.endAt) ? (
        <a onClick={toggleData} className="rounded-button btn-border">
          Make a bid
        </a>
      ) : (
        <a onClick={_endBid} className="rounded-button btn-border">
          End Bid
        </a>
      )}
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
              <input
                type="number"
                required={true}
                placeholder="bid price"
                onChange={(e) =>
                  setPrice(ethers.utils.parseUnits(e.target.value, "ether"))
                }
              />
              <div className="center">
                <button
                  className="rounded-button"
                  type="button"
                  onClick={bidNft}
                >
                  Make Bid
                </button>
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
