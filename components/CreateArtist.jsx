import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Context } from "./Context";


export default function CreateArtist() {
  const {
    client,
    Market,
    NFT,
    errorInstance,
    setErrorInstance,
    setAddress,
    nftAddress, 
    nftMarketPlaceAddress
  } = useContext(Context).state;

  const [showModal, setModal] = useState();
  const [uploaded, setIsUploaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  function toggleData() {
    setModal(!showModal);
  }
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  async function HandleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("clicked");
    await createArtist();
    toggleData();
    setFormData({
      name: ""
    });
    setProgress(0);
    setLoading(false);
    setFileUrl(null);
  }

  async function fileHandler(e) {
    setIsUploaded(false);
    const file = e.target.files[0];
    let file_size = e.target.files[0].size;
    try {
      const _added = await client.add(file, {
        progress: (prog) => {
          console.log(prog, file_size);
          setIsUploaded(prog == file_size);
          setProgress(prog / file_size);
        },
      });
      setFileUrl(`https://ipfs.infura.io/ipfs/${_added.path}`);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function createArtist() {
    const { name } = formData;
    const data = JSON.stringify({ name,image: fileUrl });
    console.log(data);
    try {
      const _added = await client.add(data);
      _addArtists({url:`https://ipfs.infura.io/ipfs/${_added.path}`,name});
    } catch (e) {
      console.log(e.message)
      setErrorInstance({ ...errorInstance, status: true, message: e.message, subTitle: e.data.message });
    }
  }

  async function _addArtists({url,name}) {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      setAddress(connection.selectedAddress)
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      //create Nft
      console.log(nftMarketPlaceAddress,Market)
      let contract = new ethers.Contract(nftMarketPlaceAddress, Market.abi, signer);
      const owner = await contract.owner()
      console.log("sdsd",owner);
      const _nft = await contract.createArtist(name, url);

      let tx = await _nft.wait();
      return tx.events[0]["transactionHash"];
    } catch (e) {
      console.log(e)
      setErrorInstance({ ...errorInstance, status: true, message: e.message ,subTitle:e.data.message});
    }
  }

  return (
    <>
      <svg onClick={() => toggleData()}
              xmlSpace="preserve"
              viewBox="0 0 400 400"
            >
              <path color="white" d="M185.778 0.481C70.980 9.211 -12.492 110.919 1.605 224.889C14.177 326.525 102.755 402.763 204.889 399.852C333.812 396.177 425.339 275.280 393.706 150.444C370.076 57.193 281.366 -6.787 185.778 0.481M211.631 20.464C240.589 22.436 268.306 31.077 292.299 45.613C392.348 106.226 409.924 241.886 328.546 325.387C320.503 333.640 321.179 333.347 320.212 329.000C311.255 288.699 278.486 257.142 239.111 250.896C231.882 249.749 166.986 249.914 159.778 251.098C121.229 257.428 88.494 289.304 79.778 329.000C78.824 333.348 79.497 333.640 71.454 325.387C32.137 285.044 14.129 230.522 21.820 175.111C34.724 82.146 118.239 14.103 211.631 20.464M192.667 90.045C167.372 93.691 148.468 106.705 137.597 127.958C113.693 174.690 147.667 229.970 200.222 229.858C259.762 229.730 291.705 160.127 253.246 114.321C238.987 97.338 213.350 87.064 192.667 90.045" />
      </svg>
      {showModal ? (
        <Modal>
          {!loading ? (
            <form className="upload">
              <a
                onClick={() => toggleData()}
                style={{ fontSize: "2rem", textAlign: "right" }}
              >
                &times;
              </a>
              <input
                placeholder="Artist Name"
                required={true}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                placeholder="Asset"
                type="file"
                onChange={fileHandler}
                required={true}
              />
              <div className="center">
                {uploaded ? (
                  <button
                    className="rounded-button"
                    type="button"
                    onClick={HandleSubmit}
                    onSubmit={HandleSubmit}
                    disabled={
                      !(progress == 1.0) ||
                      formData.name.length == 0
                    }
                  >
                    Create Artist
                  </button>
                ) : (
                  <a>Uploading.....</a>
                )}
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
