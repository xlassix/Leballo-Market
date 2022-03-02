import { useState, useContext, useEffect } from "react";
import { Context } from "./Context";
import { getAuction } from "../utils/helper";
import BuySong from "./BuySong";
import MakeBid from "./makeBid";

export default function AuctionDetailNft({ id }) {
  const { address, setErrorInstance, errorInstance } =
    useContext(Context).state;
  const [nft, setNft] = useState({ meta: {} });
  const [loaded, setLoaded] = useState(false);

  async function feedData(id) {
    setLoaded(false);
    setNft(await getAuction(id));
    setLoaded(true);
  }

  useEffect(() => {
    if (id) {
      feedData(id);
    }
  }, [id]);

  return (
    <>
      {loaded ? (
        <section className="flex">
          <img src={nft.meta.image} />
          <div className="nft-detail">
            <div className="title">
              <div className="flex flex-center">
                <h5>{nft.meta.name}</h5>
                <div className="flex flex-center">
                  <svg
                    style={{ fill: "var(--color-orange)" }}
                    viewBox="0 0 157 134"
                  >
                    <path d="M99.94 0h3.39a5 5 0 0 0 0.76 0.12 37.29 37.29 0 0 1 7.14 1 43.06 43.06 0 0 1 31 27.48 38 38 0 0 1 2.31 11.09 2.68 2.68 0 0 0 0.13 0.56v5.6a4.7 4.7 0 0 0 -0.13 0.63c-0.14 1.18 -0.21 2.37 -0.4 3.55a42.33 42.33 0 0 1 -8.87 19.91 69.68 69.68 0 0 1 -5.52 5.88l-57 57 -0.65 0.63 -0.69 -0.66L14.59 76c-0.75 -0.75 -1.51 -1.49 -2.25 -2.26A42.57 42.57 0 0 1 0 41.63a41.75 41.75 0 0 1 1.55 -9.74A43 43 0 0 1 39.75 0.69a42.15 42.15 0 0 1 10.7 0.53 42.75 42.75 0 0 1 21 10.16l0.53 0.45 0.5 -0.44c1.08 -0.9 2.12 -1.85 3.25 -2.7A42.16 42.16 0 0 1 99.25 0.12 5.54 5.54 0 0 0 99.94 0Z" />
                  </svg>
                  <p>96</p>
                </div>
              </div>
              <div className="flex-group">
                <div>
                  <h3>Current Bid</h3>
                  <svg xmlSpace="preserve">
                    <path
                      className="green-eth-icon"
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>{nft.formatted_price}</p>
                </div>
              </div>
                <p>
                  {`TokenID   :  #${nft.tokenId.toString().padStart(5, "0")}`}
                </p>
            </div>
            <div>
              <div className="flex flex-center">
                <div className="img-avatar" style={{ "--length": "3rem" }}>
                  <img src={nft["artistUrl"]} />
                </div>
                {nft.meta.artist}
              </div>
              <ul className="flex">
                <li>About</li>
                <li>Rate</li>
                <li>Story</li>
              </ul>
              <p>{nft.meta.description}</p>
            </div>
            <div className="btn-group flex">
              {(nft.status == 2|| nft.status == 1) && parseInt(nft.startAt)<(new Date().getTime()/1000) &&  parseInt(nft.endAt)>(new Date().getTime()/1000) ? (
                <>
                  <MakeBid auction={nft} />
                </>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <div className="center" style={{ padding: "10rem 0" }}>
          loading....
        </div>
      )}
    </>
  );
}
