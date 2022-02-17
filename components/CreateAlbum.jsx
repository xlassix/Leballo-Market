import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { Context } from "./Context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getArtists } from "../utils/helper";
const animatedComponents = makeAnimated();


export default function CreateAlbum() {
  const {
    client,
    Market,
    NFT,
    errorInstance,
    setErrorInstance,
    setAddress,
    nftAddress,
    nftMarketPlaceAddress,
  } = useContext(Context).state;

  const [showModal, setModal] = useState();
  const [uploaded, setIsUploaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState([]);
  function toggleData() {
    setModal(!showModal);
  }
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(
    async()=>{
      const _artists= await getArtists()
      setOptions(_artists.map(elem=>{return{"value":elem.id.toString(),"label":elem.artistName}}))
    }
    ,[showModal]
  )

  async function HandleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("clicked");
    await createAlbum();
    toggleData();
    setFormData({
      name: "",
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

  async function createAlbum() {
    const { name } = formData;
    const data = JSON.stringify({ name, image: fileUrl });
    console.log(data);
    try {
      const _added = await client.add(data);
      _addAlbum({ url: `https://ipfs.infura.io/ipfs/${_added.path}`, name,selectedOption });
    } catch (e) {
      console.log(e.message);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subTitle: e.data.message,
      });
    }
  }

  async function _addAlbum({ url, name,selectedOption }) {
    console.log(url, name,selectedOption.map(elem=>elem.value) )
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      setAddress(connection.selectedAddress);
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      //create Nft
      console.log(nftMarketPlaceAddress, Market);
      let contract = new ethers.Contract(
        nftMarketPlaceAddress,
        Market.abi,
        signer
      );
      const _nft = await contract.createAlbum(name, url,selectedOption.map(elem=>elem.value));

      let tx = await _nft.wait();
      return tx.events[0]["transactionHash"];
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subTitle: e.data.message,
      });
    }
  }

  return (
    <>
    <svg onClick={() => toggleData()}
              xmlSpace="preserve"
              viewBox="0 0 125 99"
            >
            <path color="white"
            d="M68.37 62.24c0.34 -0.06 0.68 -0.08 1 -0.08c0.15 0 0.3 0.01 
            0.45 0.03V50.66l-12.46 3.58v14.27c0 0.05 0 0.21 0.01 0.24c0 1.1
             -0.56 2.18 -1.48 3.05c-0.89 0.84 -2.11 1.48 -3.46 1.71c-0.37 0.06 
             -0.73 0.1 -1.08 0.1c-1.01 0 -1.92 -0.26 -2.61 -0.73c-0.72 -0.48 
             -1.2 -1.17 -1.35 -2.01c-0.03 -0.17 -0.05 -0.35 -0.05 -0.52c0 
             -1.1 0.56 -2.18 1.48 -3.04c0.89 -0.84 2.11 -1.48 3.46 -1.71c0.5 
             -0.09 0.99 -0.11 1.45 -0.08c0.28 0.02 0.54 0.06 0.79 0.11l0 
             -17.81h0.48l17.64 -4.04v20.69l0.03 0.22c0.01 0.09 0.01 0.18 
             0.01 0.26c0 0.94 -0.48 1.86 -1.26 2.59c-0.75 0.71 -1.79 1.25 
             -2.93 1.45c-0.31 0.05 -0.62 0.08 -0.91 0.08c-0.86 0 -1.63 -0.22 
             -2.22 -0.62c-0.61 -0.41 -1.03 -1 -1.15 -1.72c-0.03 -0.15 -0.04
              -0.3 -0.04 -0.45c0 -0.94 0.48 -1.86 1.26 -2.59C66.2 62.97 
              67.23 62.43 68.37 62.24L68.37 62.24zM61.44 31.38c7.44 0 
              14.18 3.02 19.06 7.89c4.88 4.88 7.89 11.61 7.89 19.06c0 7.44 -3.02 14.18 -7.89 19.05c-4.88 4.88 -11.61 7.89 -19.06 7.89c-7.44 0 -14.18 -3.02 -19.05 -7.89c-4.88 -4.88 -7.89 -11.61 -7.89 -19.05c0 -7.44 3.02 -14.18 7.89 -19.06C47.26 34.4 54 31.38 61.44 31.38L61.44 31.38zM77.15 42.61c-4.02 -4.02 -9.58 -6.51 -15.71 -6.51c-6.14 0 -11.69 2.49 -15.71 6.51c-4.02 4.02 -6.51 9.58 -6.51 15.71c0 6.14 2.49 11.69 6.51 15.71c4.02 4.02 9.58 6.51 15.71 6.51c6.14 0 11.69 -2.49 15.71 -6.51c4.02 -4.02 6.51 -9.58 6.51 -15.71C83.66 52.19 81.18 46.63 77.15 42.61L77.15 42.61zM2.48 20.74h4.5v-9.86c0 -1.37 1.11 -2.48 2.48 -2.48h4.41V2.48c0 -1.37 1.11 -2.48 2.48 -2.48h40.26c1.37 0 2.48 1.11 2.48 2.48V8.4h54.3c1.37 0 2.48 1.11 2.48 2.48v9.86h4.53c1.37 0 2.48 1.11 2.48 2.48c0 0.18 -0.02 0.36 -0.06 0.52l-8.68 63.81c-0.28 2.08 -1.19 4.01 -2.59 5.41c-1.38 1.38 -3.21 2.24 -5.36 2.24H14.7c-2.16 0 -4.03 -0.87 -5.43 -2.26c-1.41 -1.41 -2.31 -3.35 -2.54 -5.46l-6.72 -64c-0.14 -1.36 0.85 -2.58 2.21 -2.72C2.31 20.75 2.39 20.75 2.48 20.74L2.48 20.74L2.48 20.74L2.48 20.74zM9.46 25.71H5.23l6.44 61.27c0.1 0.98 0.5 1.85 1.1 2.46c0.5 0.5 1.17 0.81 1.93 0.81h91.5c0.75 0 1.38 -0.3 1.87 -0.79c0.62 -0.62 1.03 -1.53 1.17 -2.55l8.32 -61.19L9.46 25.71L9.46 25.71L9.46 25.71zM11.94 13.37v7.36l98.97 -1.05v-6.31h-54.3c-1.37 0 -2.48 -1.11 -2.48 -2.48V4.97h-35.3v5.92c0 1.37 -1.11 2.48 -2.48 2.48L11.94 13.37L11.94 13.37L11.94 13.37z" />
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
                placeholder="Album Name"
                required={true}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                placeholder="Album Cover"
                type="file"
                onChange={fileHandler}
                required={true}
              />
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                isSearchable
                placeholder="Select Artist"
                options={options}
                required={true}
                onChange={setSelectedOption}
                noOptionsMessage={({ inputValue: string }) =>"No more Artists to select"}
              />
              <div className="center">
                {uploaded ? (
                  <button
                    className="rounded-button"
                    type="button"
                    onClick={HandleSubmit}
                    onSubmit={HandleSubmit}
                    disabled={!(progress == 1.0) || formData.name.length == 0|| selectedOption.length==0}
                  >
                    Create Album
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
