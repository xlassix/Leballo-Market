import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Detail from "../components/Details"

export default function AccountPage() {
  return (
    <>
      <Nav  />
      <div className="bg-dark">
        <Detail />
        <Footer></Footer>
      </div>
    </>
  );
}
