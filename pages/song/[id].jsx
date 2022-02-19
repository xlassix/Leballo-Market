import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import DetailNft from "../../components/Details";
import { useRouter } from "next/router";
import { useContext } from "react";
import dynamic from "next/dynamic";
import { Context } from "../../components/Context";

const Modal = dynamic(() => import("../../components/Modal"));
export default function DetailPage() {
  const { address, errorInstance, setErrorInstance, setAddress } =
  useContext(Context).state;
  const router =useRouter();
  const {id} =router.query;

  return (
    <>
      <Nav  />
      <div className="bg-dark">
        <DetailNft id={id}/>
        <Footer></Footer>
        {errorInstance.status  ? (
        <Modal>
          <div className="upload">
            <a
              onClick={() => {
                setErrorInstance({
                  ...errorInstance,
                  status: false,
                  count: errorInstance.count + 1,
                });
              }}
              style={{ fontSize: "2rem", textAlign: "right" }}
            >
              &times;
            </a>
            <h5 style={{ textAlign: "center", padding: "7rem" }}>
              {errorInstance.message?errorInstance.message:"Disconnected"}
            </h5>
            <p style={{ textAlign: "center" }}>
              {
                errorInstance.subTitle?
              errorInstance.subTitle 
              :"kindly Install MetaMask and Verify you on the Polygon Network(TestNet)"
              }
            </p>
          </div>
        </Modal>
      ) : null}
      </div>
    </>
  );
}
