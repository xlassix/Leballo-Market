import { useState } from "react";
import Link from "next/link";
import CreateNft from "./createItems";

function Nav({ isAdmin,connection }) {
  console.log(isAdmin,connection);
  const [mobileNavIconVisibility, setMobileNavIconVisibility] = useState(false);
  const [mobileNavVisibility, setMobileNavVisibility] = useState(false);
  function toggleNavVisiblity() {
    setMobileNavIconVisibility(!mobileNavIconVisibility);
    setMobileNavVisibility(!mobileNavVisibility);
  }
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>
                <img src="/Asset 1.png" alt="Logo" />
              </a>
            </Link>
          </li>
          <li>
            <a href="#">MarketPlace</a>
          </li>
          <li>
            <a href="#">Resource</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <form className="search">
              <input type="text" placeholder="Search" />
              <button>
                <svg viewBox="0 0 145 145">
                  <path d="M64.84 9.42A55.42 55.42 0 0 1 104 104 55.42 55.42 0 0 1 25.65 25.65 55 55 0 0 1 64.84 9.42m0 -9.42a64.84 64.84 0 1 0 45.84 19A64.63 64.63 0 0 0 64.84 0Z" />
                  <path d="M136.18 137.42a4.69 4.69 0 0 1 -3.33 -1.38l-18.26 -18.26a4.71 4.71 0 0 1 6.66 -6.66l18.26 18.26a4.71 4.71 0 0 1 -3.33 8Z" />
                </svg>
              </button>
            </form>
          </li>
          <li>
          {isAdmin===true ? (
            <CreateNft />
          ) : (
            <Link href="/account">
              <a className="rounded-button">My Account</a>
            </Link>
          )}
          </li>
          <li>
            <a className="rounded-button" >{connection ? `${connection.selectedAddress.substring(0,6)}...${connection.selectedAddress.substr(-5)}` :"Connect Wallet"}</a>
          </li>
          <svg
            className={
              mobileNavVisibility
                ? "mobile-nav-icon"
                : "mobile-nav-icon visible"
            }
            onClick={() => {
              toggleNavVisiblity();
            }}
          >
            <path d="M1 2H9C9.26522 2 9.51957 1.89464 9.70711 1.70711C9.89464 1.51957 10 1.26522 10 1C10 0.734784 9.89464 0.48043 9.70711 0.292893C9.51957 0.105357 9.26522 0 9 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734784 2 1 2ZM18 9C18 8.73478 17.8946 8.48043 17.7071 8.29289C17.5196 8.10536 17.2652 8 17 8H1C0.734784 8 0.48043 8.10536 0.292893 8.29289C0.105357 8.48043 0 8.73478 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10H17C17.2652 10 17.5196 9.89464 17.7071 9.70711C17.8946 9.51957 18 9.26522 18 9ZM17 16H9C8.73478 16 8.48043 16.1054 8.29289 16.2929C8.10536 16.4804 8 16.7348 8 17C8 17.2652 8.10536 17.5196 8.29289 17.7071C8.48043 17.8946 8.73478 18 9 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17C18 16.7348 17.8946 16.4804 17.7071 16.2929C17.5196 16.1054 17.2652 16 17 16Z" />
          </svg>
        </ul>
      </nav>
      <ol className={mobileNavVisibility ? "mobile-nav" : "mobile-nav appear"}>
        <li>
          <a href="#">MarketPlace</a>
        </li>
        <li>
          <a href="#">Resource</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
      </ol>
    </>
  );
}

export default Nav;
