import ScrollAnimation from "react-animate-on-scroll";
export default function Spec() {
  return (
    <div className="bgcolor_lit_purple">
      <section id="more-intro">
        <h3>THE AMAZING NET ART OF THE WORLD HERE</h3>
        <div>
          <svg viewBox="0 0 155 135" xmlSpace="preserve">
            <path d="M3.52 36.02H86.96V43.06H3.52V36.02Z" />
            <path d="M26.42 92.49H50.33V99.53H26.42V92.49Z" />
            <path d="M58.72 92.49H97.75V99.53H58.72V92.49Z" />
            <path d="M116.93 40.4L100.69 24.16 105.67 19.18 116.93 30.44 147.38 0 152.36 4.98 116.93 40.4Z" />
            <path d="M125.35 131.65H22.57A22.6 22.6 0 0 1 0 109.08V25.74A22.6 22.6 0 0 1 22.57 3.17H87v7H22.57A15.55 15.55 0 0 0 7 25.74v83.34a15.55 15.55 0 0 0 15.53 15.53H125.35a15.54 15.54 0 0 0 15.53 -15.53V55.84h7v53.24A22.59 22.59 0 0 1 125.35 131.65Z" />
          </svg>
          <article>
            <h4>Fast Transaction</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum,
              fugit dignissimos! Suscipit vel molestiae quod, consequuntur
              voluptas quasi aut hic nesciunt
            </p>
          </article>
        </div>
        <div>
          <svg viewBox="0 0 150 155" xmlSpace="preserve">
            <path d="M125.92 154.83H23.23A23.25 23.25 0 0 1 0 131.61V23.23A23.26 23.26 0 0 1 23.23 0H125.92a23.26 23.26 0 0 1 23.23 23.23V131.61A23.25 23.25 0 0 1 125.92 154.83ZM23.23 7.25a16 16 0 0 0 -16 16V131.61a16 16 0 0 0 16 16H125.92a16 16 0 0 0 16 -16V23.23a16 16 0 0 0 -16 -16Z" />
            <path d="M65.94 121.48H34.18V78.83A12.87 12.87 0 0 1 47 66H65.94Zm-24.51 -7.25H58.69v-41H47a5.61 5.61 0 0 0 -5.6 5.61Z" />
            <path d="M115 121.48H83.21V80.88H105A9.94 9.94 0 0 1 115 90.81Zm-24.5 -7.25h17.26V90.81A2.7 2.7 0 0 0 105 88.12H90.46Z" />
            <path d="M90.46 121.48H58.69V33.36H90.46Zm-24.52 -7.25H83.21V40.61H65.94Z" />
          </svg>
          <article>
            <h4>Fast Transaction</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum,
              fugit dignissimos! Suscip
            </p>
          </article>
        </div>
      </section>

      <section id="featured">
        <div id="top-featured">
          <img
            className="rounded-corners"
            style={{ "--radius": "1.5rem", objectFit: "contain" }}
            src="./img/Asset 1.png"
          />
          <div>
            <div className="detail">
              <div
                className="blank_sq_image"
                style={{ "--length": "3rem", "--radius": "50%" }}
              ></div>
              <div>
                <h4>The Song Title</h4>
                <p>10 is in Stock</p>
              </div>
            </div>
            <div>
              <h5>Hights Bid</h5>
              <div className="price">
                <svg viewBox="0 0 20px 20px" xmlSpace="preserve">
                  <path
                    style={{ fill: "currentColor" }}
                    d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                  />
                </svg>
                <p>0.25 USD</p>
              </div>
            </div>
          </div>
        </div>
        <div id="list-featured">
          <article>
            <img
              className="rounded-corners"
              src="https://ipfs.infura.io/ipfs/QmbqDinZXs8Sfp67fKNRYYpp92L4Bm9VYu2bWZgodMY3YG"
            />
            <div className="flex">
              <h6>The Song Title</h6>
              <div className="flex flex-sb">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "3rem", "--radius": "50%" }}
                ></div>
                <div className="price">
                  <svg viewBox="0 0 20px 20px" xmlSpace="preserve">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
                <p>1 of 8</p>
              </div>
              <button disabled={true} className="rounded-button invented-btn">
                Place a Bid
              </button>
            </div>
          </article>
          <article>
            <img
              className="rounded-corners"
              src="https://ipfs.infura.io/ipfs/QmbqDinZXs8Sfp67fKNRYYpp92L4Bm9VYu2bWZgodMY3YG"
            />
            <div className="flex">
              <h6>The Song Title</h6>
              <div className="flex flex-sb">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "3rem", "--radius": "50%" }}
                ></div>
                <div className="price">
                  <svg viewBox="0 0 20px 20px">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
                <p>1 of 8</p>
              </div>
              <button disabled={true} className="rounded-button invented-btn">
                Place a Bid
              </button>
            </div>
          </article>
          <article>
            <img
              className="rounded-corners"
              src="https://ipfs.infura.io/ipfs/QmbqDinZXs8Sfp67fKNRYYpp92L4Bm9VYu2bWZgodMY3YG"
            />
            <div className="flex">
              <h6>The Song Title</h6>
              <div className="flex flex-sb">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "3rem", "--radius": "50%" }}
                ></div>
                <div className="price">
                  <svg viewBox="0 0 20px 20px">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
                <p>1 of 8</p>
              </div>
              <button disabled={true}  className="rounded-button invented-btn">
                Place a Bid
              </button>
            </div>
          </article>
        </div>
        <div id="top-collection">
          <h3>TOP COLLECTION OVER</h3>
          <h4>Last 7 days</h4>
          <div>
            <article>
              <h4>1</h4>
              <div className="image-with-verification">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "4rem", "--radius": "50%" }}
                ></div>
                <img src="./img/Asset 4.svg" />
              </div>
              <div className="detail">
                <h5>Crypto FUNK</h5>
                <div className="price">
                  <svg viewBox="0 0 20px 20px">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
              </div>
              <h6 style={{ color: "var(--color-green)" }}>+23.6%</h6>
            </article>

            <article>
              <h4>2</h4>
              <div className="image-with-verification">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "4rem", "--radius": "50%" }}
                ></div>
              </div>
              <div className="detail">
                <h5>Crypto FUNK</h5>
                <div className="price">
                  <svg viewBox="0 0 20px 20px">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
              </div>
              <h6 style={{ color: "red" }}>-24.6%</h6>
            </article>

            <article>
              <h4>3</h4>
              <div className="image-with-verification">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "4rem", "--radius": "50%" }}
                ></div>
              </div>
              <div className="detail">
                <h5>Crypto FUNK</h5>
                <div className="price">
                  <svg viewBox="0 0 20px 20px" xmlSpace="preserve">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
              </div>
              <h6 style={{ color: "var(--color-green)" }}>+23.6%</h6>
            </article>
            <article>
              <h4>4</h4>
              <div className="image-with-verification">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "4rem", "--radius": "50%" }}
                ></div>
                <img src="./img/Asset 4.svg" />
              </div>
              <div className="detail">
                <h5>Crypto FUNK</h5>
                <div className="price">
                  <svg viewBox="0 0 20px 20px" xmlSpace="preserve">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
              </div>
              <h6 style={{ color: "var(--color-green)" }}>+23.6%</h6>
            </article>
            <article>
              <h4>5</h4>
              <div className="image-with-verification">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "4rem", "--radius": "50%" }}
                ></div>
              </div>
              <div className="detail">
                <h5>Crypto FUNK</h5>
                <div className="price">
                  <svg viewBox="0 0 20px 20px" xmlSpace="preserve">
                    <path
                      style={{ fill: "currentColor" }}
                      d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                    />
                  </svg>
                  <p>0.25 USD</p>
                </div>
              </div>
              <h6 style={{ color: "red" }}>-23.6%</h6>
            </article>
          </div>
        </div>
      </section>

      <ScrollAnimation animateIn="fadeIn">
        <section id="nft-collections">
          <h2>COLLECTION FEATURED NFTS</h2>
          <div id="collections">
            <div>
              <div className="collection">
                <img className="main" src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
              </div>
              <h4>Amazing collection</h4>
              <div className="flex flex-center">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "3rem" }}
                ></div>
                <p>By Artist Name</p>
                <button className="rounded-button flex-leftmost invented-btn">
                  Total 57 items
                </button>
              </div>
            </div>
            <div>
              <div className="collection">
                <img className="main" src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
              </div>
              <h4>Amazing collection</h4>
              <div className="flex flex-center">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "3rem" }}
                ></div>
                <p>By Artist Name</p>
                <button className="rounded-button flex-leftmost invented-btn">
                  Total 57 items
                </button>
              </div>
            </div>
            <div>
              <div className="collection">
                <img className="main" src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
                <img src="./img/Asset 1.png" />
              </div>
              <h4>Amazing collection</h4>
              <div className="flex flex-center">
                <div
                  className="blank_sq_image"
                  style={{ "--length": "3rem" }}
                ></div>
                <p>By Artist Name</p>
                <button className="rounded-button flex-leftmost invented-btn">
                  Total 57 items
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
}
