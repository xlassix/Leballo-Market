import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MarketNfts from "../components/MarkerNfts";
import dynamic from "next/dynamic";




export default function Home() {


  return (
    <>
      <Nav />
      <MarketNfts />
      <Footer></Footer>
    </>
  );
}
