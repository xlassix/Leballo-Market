import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Context } from "./Context";

export default function WithdrawAuction({ id }) {
  const { Auction, errorInstance, setErrorInstance, auctionAddress } =
    useContext(Context).state;
  const router = useRouter();

  useEffect(() => {
    getBalance();
  }, []);

  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState();
  const [balance, setBalance] = useState(0);

  async function withdraw(e) {
    setLoading(true);
    await _withdraw();
    setLoading(false);
    toggleData();
  }

  async function getBalance() {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(auctionAddress, Auction.abi, signer);

      var transaction = await contract.amountInAuction(id);
      setBalance(ethers.utils.formatEther(parseInt(transaction).toString()));
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subTitle: e.data ? e.data.message : "",
      });
    }
  }

  async function _withdraw() {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(auctionAddress, Auction.abi, signer);

      var transaction = await contract.withdraw(id);
      console.log(transaction);

      await transaction.wait();
      router.push("/account");
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subTitle: e.data ? e.data.message : "",
      });
    }
  }

  function toggleData() {
    setModal(!showModal);
  }
  return (
    <>
      <a onClick={() => toggleData()} className="rounded-button btn-border">
        Withdraw : {balance} MATIC
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
                <a className="rounded-button" type="button" onClick={withdraw}>
                  withdraw
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
