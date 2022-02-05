import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Nfts from "../components/Nfts";
import dynamic from "next/dynamic";




export default function Home() {


  return (
    <>
      <Nav></Nav>
      <Nfts></Nfts>
      <Footer></Footer>
    </>
  );
}
