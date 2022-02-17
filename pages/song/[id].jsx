import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import DetailNft from "../../components/Details";
import { useRouter } from "next/router";

export default function DetailPage() {

  const router =useRouter();
  const {id} =router.query;

  return (
    <>
      <Nav  />
      <div className="bg-dark">
        <DetailNft id={id}/>
        <Footer></Footer>
      </div>
    </>
  );
}
