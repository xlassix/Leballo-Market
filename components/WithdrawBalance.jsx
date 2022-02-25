import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Context } from "./Context";

export default function WithdrawBalance() {
  const {
    Market,
    errorInstance,
    setErrorInstance,
    nftMarketPlaceAddress,
  } = useContext(Context).state;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState();

  async function withdraw(e) {
    setLoading(true);
    await _withdraw();
    setLoading(false);
    toggleData();
  }

  async function _withdraw() {
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

      var transaction = await contract.withdraw();
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
      <svg onClick={() => toggleData()} viewBox="0 0 150 150">
        <path
          color="white"
          d="M71.21 6.91a64.3 64.3 0 1 1 -64.3 64.3 64.37 64.37 0 0 1 64.3 -64.3m0 -6.91a71.21 71.21 0 1 0 71.21 71.21A71.21 71.21 0 0 0 71.21 0Z"
        />

        <path
          color="white"
          d="M88 105.09H54.46A12.59 12.59 0 0 1 41.89 92.52V69.39H48.8V92.52a5.67 5.67 0 0 0 5.66 5.67H88a5.67 5.67 0 0 0 5.67 -5.67V69.39h6.91V92.52A12.59 12.59 0 0 1 88 105.09Z"
        />
        <path
          color="white"
          d="M56.77 60.34L51.89 55.45 71.45 35.89 90.53 54.97 85.65 59.86 71.45 45.66 56.77 60.34Z"
        />
        <path color="white" d="M67.99 40.78H74.9V85.52H67.99V40.78Z" />
      </svg>
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
