import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { Context } from "./Context";
import { getAlbums, getAlbum } from "../utils/helper";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

export default function CreateSong() {
  const router =useRouter();
  const {
    client,
    nftAddress,
    Market,
    NFT,
    nftMarketPlaceAddress,
    errorInstance,
    setErrorInstance,
    setAddress,
  } = useContext(Context).state;

  const [albums, setAlbums] = useState([]);
  const [artist, setArtists] = useState([]);
  const [showModal, setModal] = useState(false);
  const [_album, setAlbum] = useState();
  const [_artist, setArtist] = useState({ value: null });
  const [uploaded, setIsUploaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  function toggleData() {
    setModal(!showModal);
  }
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    name: "",
    description: "",
  });

  useEffect(async () => {
    if (albums.length == 0) {
      const _artists = await getAlbums();
      setAlbums(
        _artists.map((elem) => {
          return { value: elem.id.toString(), label: elem.albumName };
        })
      );
    }
    if (_album) {
      const _albums = await getAlbum(_album.value);
      setArtist({ value: null });
      setArtists(
        _albums["_artists"].map((elem) => {
          return { value: elem.id.toString(), label: elem.artistName };
        })
      );
    }
  }, [showModal, _album]);

  async function HandleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await createItem(e);
    setFormData({
      price: "",
      name: "",
      description: "",
    });
    setProgress(0);
    setLoading(false);
    setFileUrl(null);
    toggleData();
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

  async function createItem() {
    const { name, description, price } = formData;
    const data = JSON.stringify({
      name,
      price,
      description,
      image: fileUrl,
      album: _album.label,
      artist: _artist.label,
    });
    console.log(data);
    const _added = await client.add(data);
    var id = await createSales(`https://ipfs.infura.io/ipfs/${_added.path}`);
    router.push(`/song/${id}`)
    setModal(false);
  }

  async function createSales(url) {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      setAddress(connection.selectedAddress);
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      //create Nft
      let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
      console.log(url);
      const _nft = await contract.createToken(url);
      let tx = await _nft.wait();
      const tokenId = tx.events[0].args[2].toNumber();

      //list Nfts on Market place
      const price = ethers.utils.parseUnits(formData.price, "ether");
      contract = new ethers.Contract(nftMarketPlaceAddress, Market.abi, signer);

      const transaction = await contract.createSong(
        nftAddress,
        tokenId,
        parseInt(_album.value),
        parseInt(_artist.value),
        price
      );
      tx = await transaction.wait();
      return tx.events[2].args["itemId"].toString();
    } catch (e) {
      console.log(e);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        // subTitle: e.data.message ?e.data.message:null,
      });
    }
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
          {!loading ? (
            <form className="upload">
              <a
                onClick={() => toggleData()}
                style={{ fontSize: "2rem", textAlign: "right" }}
              >
                &times;
              </a>
              <input
                placeholder="Asset Name"
                required={true}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <textarea
                placeholder="Asset Description"
                required={true}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
              />
              <Select
                components={animatedComponents}
                isSearchable
                placeholder="Select Album"
                options={albums}
                required={true}
                onChange={setAlbum}
                noOptionsMessage={({ inputValue: string }) =>
                  "No more Album to select"
                }
              />
              <Select
                components={animatedComponents}
                isSearchable
                placeholder="Select Artist"
                options={artist}
                required={true}
                value={_artist}
                onChange={setArtist}
                noOptionsMessage={({ inputValue: string }) =>
                  "No more Artist to select"
                }
              />
              <input
                placeholder="Asset Price"
                type="number"
                required={true}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
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
                      formData.description.length == 0 ||
                      !/^\d+$|(\d+[.]\d+)$/.test(formData.price) ||
                      formData.name.length == 0 ||
                      _artist == null ||
                      _album.value == null
                    }
                  >
                    Create Nft
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
