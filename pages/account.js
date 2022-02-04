import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Profile from "../components/profile";
export default function AccountPage() {
  return (
    <>
      <Nav></Nav>
      <div className="bg-dark">
        <Profile></Profile>
        <Footer></Footer>
      </div>
    </>
  );
}
