import CreateSong from "./CreateSong";
import CreateArtist from "./CreateArtist";
import CreateAlbum from "./CreateAlbum";
import { useContext } from "react";
import { Context } from "./Context";
import WithdrawBalance from "./WithdrawBalance"

export default function Profile({ artists, albums }) {
  const { address, ownerAddress } = useContext(Context).state;
  return (
    <>
      <section>
        <div className="profile-pic">
          <img className="wall" src="/img/Asset 6.png" />
          <img className="main" src="/img/Avatar.png" />
        </div>
      </section>
      <section id="profile">
        {console.log(address, ownerAddress, address === ownerAddress)}
        <div className="details">
          <h2>Artist Name</h2>
          {address === ownerAddress ? (
            <div className="actions">
              <div>
                <CreateAlbum options={artists} />
                <p>Create Album</p>
              </div>
              <div>
                <WithdrawBalance />
                <p>withdraw</p>
              </div>
              <div>
                <CreateArtist />
                <p>Create Artist</p>
              </div>
              <div>
                <CreateSong />
                <p>Create Song</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="line">
          <form>
            <svg viewBox="0 0 145 145">
              <path d="M64.84 9.42A55.42 55.42 0 0 1 104 104 55.42 55.42 0 0 1 25.65 25.65 55 55 0 0 1 64.84 9.42m0 -9.42a64.84 64.84 0 1 0 45.84 19A64.63 64.63 0 0 0 64.84 0Z" />
              <path d="M136.18 137.42a4.69 4.69 0 0 1 -3.33 -1.38l-18.26 -18.26a4.71 4.71 0 0 1 6.66 -6.66l18.26 18.26a4.71 4.71 0 0 1 -3.33 8Z" />
            </svg>
            <input type="text" placeholder="Search by song" />
          </form>
          <div>
            <p>Top Songs</p>
            <svg viewBox="0 0 960 560">
              <path d="M480 344.181L268.869 131.889c-15.756 -15.859 -41.3 -15.859 -57.054 0c-15.754 15.857 -15.754 41.57 0 57.431l237.632 238.937c8.395 8.451 19.562 12.254 30.553 11.698c10.993 0.556 22.159 -3.247 30.555 -11.698l237.631 -238.937c15.756 -15.86 15.756 -41.571 0 -57.431s-41.299 -15.859 -57.051 0L480 344.181z" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
