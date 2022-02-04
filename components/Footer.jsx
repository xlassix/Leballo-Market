export default function Footer(){
    return (
        <section>
        <footer>
          <article>
            <h3>NFTERS</h3>
            <p>The world first and largest digital MarketPlace for crypto collectibles and non-fungible tokens(NFTs).<br />Buy, Sell and discover exclusive digital items</p>
            <div className="flex">
              <div className="blank_sq_image" style={{'--length':'3rem','--bg-color':'#3b5b98'}}></div>
              <div className="blank_sq_image" style={{'--length':'3rem','--bg-color':'#56aeed'}}></div>
              <div className="blank_sq_image" style={{'--length':'3rem','--bg-color':'#017cb7'}}></div>
            </div>
          </article>
          <div>
            <h4>Market Place</h4>
            <ul>
              <li><a href="#">All NFTs</a></li>
              <li><a href="#">New</a></li>
              <li><a href="#">Arts</a></li>
              <li><a href="#">Most Viewed</a></li>
              <li><a href="#">Top Sales</a></li>
              <li><a href="#">Music</a></li>
              <li><a href="#">All NFTs</a></li>
            </ul>
          </div>
          <div>
            <h4>My Account</h4>
            <ul>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Favorite</a></li>
              <li><a href="#">My collection</a></li>
              <li><a href="#">Settings</a></li>
            </ul>
          </div>
          <div>
            <h4>
              Stay In The Loop
            </h4>
            <p>Join our maillst to join in the loop with our latest features release, NFT drops and tricks and tips for navigations NFTs</p>
            <form>
              <input type="email" name="style" placeholder="Enter Your Email Address"/>
              <button className="button rounded-button">Subscribe Now</button>
            </form>
          </div>
        </footer>
        </section>
    )
}