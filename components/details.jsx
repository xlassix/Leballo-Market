import { useState, useEffect } from "react";
export default function MarketNfts() {
  const nftPerPage = 20;
  const [showModal, setModal] = useState();
  const [page, setPage] = useState(1);
  function toggleData() {
    setModal(!showModal);
  }
  const [errorInstance, setErrorInstance] = useState({
    status: false,
    message: "",
    subtitle: "",
    count: 0,
  });

  return (
    <section className="flex">
        <img src="../public/img/Asset 1.png" />
        <div className="nft-detail">
          <div className="title">
            <div className="flex flex-center">
              <h5>Song Title</h5>
              <div className="flex flex-center">
                <svg style={{fill: "var(--color-orange)"}} viewBox="0 0 157 134">
                  <path
                    d="M99.94 0h3.39a5 5 0 0 0 0.76 0.12 37.29 37.29 0 0 1 7.14 1 43.06 43.06 0 0 1 31 27.48 38 38 0 0 1 2.31 11.09 2.68 2.68 0 0 0 0.13 0.56v5.6a4.7 4.7 0 0 0 -0.13 0.63c-0.14 1.18 -0.21 2.37 -0.4 3.55a42.33 42.33 0 0 1 -8.87 19.91 69.68 69.68 0 0 1 -5.52 5.88l-57 57 -0.65 0.63 -0.69 -0.66L14.59 76c-0.75 -0.75 -1.51 -1.49 -2.25 -2.26A42.57 42.57 0 0 1 0 41.63a41.75 41.75 0 0 1 1.55 -9.74A43 43 0 0 1 39.75 0.69a42.15 42.15 0 0 1 10.7 0.53 42.75 42.75 0 0 1 21 10.16l0.53 0.45 0.5 -0.44c1.08 -0.9 2.12 -1.85 3.25 -2.7A42.16 42.16 0 0 1 99.25 0.12 5.54 5.54 0 0 0 99.94 0Z"
                  />
                </svg>
                <p>96</p>
              </div>
            </div>
            <div className="flex-group">
              <div>
                <svg xmlSpace="preserve">
                  <path
                    className="green-eth-icon"
                    d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                  />
                </svg>
                <p>0.25 USD</p>
              </div>
              <p>20 out of 100 Available</p>
            </div>
          </div>
          <div>
            <div className="flex flex-center">
              <div className="blank_sq_image" style={{"--length": "3rem"}}></div>
              Artist Name
            </div>
            <ul className="flex">
              <li>
                About
              </li>
              <li>
                Rate
              </li>
              <li>
                Story
              </li>
            </ul>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa
              itaque adipisci, consequatur eos unde perferendis, aliquid
              voluptas totam reiciendis, voluptate non ratione magnam neque
              dolore dignissimos modi eum sapiente qui! Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Fugiat, ducimus animi
              voluptates officia ipsa ut enim quidem consequatur impedit velit
              quod praesentium cumque consectetur libero tenetur? Fugiat placeat
              reprehenderit earum!
            </p>
          </div>
          <div className="btn-group flex">
            <a className="rounded-button btn-grad flex-50">buy now</a>
            <a className="rounded-button btn-border flex-50">Place Order</a>
          </div>
        </div>
      </section>
  );
}