import Modal from "./Modal";
import { useState,useContext } from "react";
export default function MyNftCard({ nft, listFunc }) {

  const [showModal, setModal] = useState(false);
  const [sellingPrice, setSellingPrice] = useState();
  const [loading, setLoading] = useState(true);
  function toggleData() {
    console.log(showModal);
    setModal(!showModal);
  }
  return (
    <>
      <figure
        onClick={() => {
          toggleData();
        }}
      >
        <img
          src={nft.image}
          onClick={() => {
            toggleData();
          }}
        />
        <figcaption
          onClick={() => {
            toggleData();
          }}
        >
          <h5>{nft.name}</h5>
          <div className="flex flex-center">
            <p>{nft.price}</p>
            <div className="flex flex-center 9">
              <svg
                style={{ fill: "var(--color-orange)" }}
                viewBox="0 0 157 134"
              >
                <path d="M99.94 0h3.39a5 5 0 0 0 0.76 0.12 37.29 37.29 0 0 1 7.14 1 43.06 43.06 0 0 1 31 27.48 38 38 0 0 1 2.31 11.09 2.68 2.68 0 0 0 0.13 0.56v5.6a4.7 4.7 0 0 0 -0.13 0.63c-0.14 1.18 -0.21 2.37 -0.4 3.55a42.33 42.33 0 0 1 -8.87 19.91 69.68 69.68 0 0 1 -5.52 5.88l-57 57 -0.65 0.63 -0.69 -0.66L14.59 76c-0.75 -0.75 -1.51 -1.49 -2.25 -2.26A42.57 42.57 0 0 1 0 41.63a41.75 41.75 0 0 1 1.55 -9.74A43 43 0 0 1 39.75 0.69a42.15 42.15 0 0 1 10.7 0.53 42.75 42.75 0 0 1 21 10.16l0.53 0.45 0.5 -0.44c1.08 -0.9 2.12 -1.85 3.25 -2.7A42.16 42.16 0 0 1 99.25 0.12 5.54 5.54 0 0 0 99.94 0Z" />
              </svg>
              <p>96</p>
            </div>
          </div>
        </figcaption>
      </figure>
      {showModal ? (
        <Modal>
          <form className="upload">
            <a
              onClick={() => toggleData()}
              style={{ fontSize: "2rem", textAlign: "right" }}
            >
              &times;
            </a>
            {loading ? (
              <>
                <input
                  placeholder="Asset Price"
                  type="number"
                  required
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
                <div className="center">
                  <a
                    onClick={async () => {
                      setLoading(true);
                      await listFunc(sellingPrice);
                    }}
                    className="rounded-button"
                  >
                    list
                  </a>
                </div>
              </>
            ) : (
              <p style={{ textAlign: "center", padding: "7rem 0" }}>
                Processing...
              </p>
            )}
          </form>
        </Modal>
      ) : null}
    </>
  );
}
