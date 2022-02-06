export default function MarketNftCard({nft,onPurchase}){
    return(
        <figure>
        <img src={nft.image} />
        <div className="avatars">
          <img src="/img/Avatar.png" />
          <img src="/img/Avatar.png" />
          <img src="/img/Avatar.png" />
        </div>
        <figcaption>
          <h3>{nft.name}</h3>
          <div className="flex-group">
            <div>
              <svg xmlSpace="preserve">
                <path
                  className="green-eth-icon"
                  d="M11.944 17.97L4.58 13.62 11.943 24l7.37 -10.38 -7.372 4.35h0.003zM12.056 0L4.69 12.223l7.365 4.354 7.365 -4.35L12.056 0z"
                />
              </svg>
              <p>{nft.price}</p>
            </div>
            <p>1 of 415</p>
          </div>
          <div className="divider"></div>
          <div className="flex-group">
            <button className="rounded-button">3h 56m 12s</button>
            <a onClick={()=>{onPurchase()}}>Place an Order</a>
          </div>
        </figcaption>
      </figure>
    )
}