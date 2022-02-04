import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Details from "../components/MyNft";
import dynamic from 'next/dynamic'
import {ethers} from "ethers";
import {useEffect,useState} from "react"
import axios from "axios";
import Web3Modal from "web3modal";

const DynamicComponent= dynamic(() => import('../components/MyNft'), {
  ssr: false
})

export default function Home() {
    return (
      <>
        <Nav></Nav>
        <DynamicComponent></DynamicComponent>
        <Footer></Footer>
      </>
    );
}
