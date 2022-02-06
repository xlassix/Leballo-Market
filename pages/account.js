import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Profile from "../components/profile";
import "../styles/upload.module.css"
import MyNfts from "../components/MyNfts";
export default function AccountPage() {
  return (
    <>
      <Nav isAdmin={true} />
      <div className="bg-dark">
        <Profile></Profile>
        <MyNfts />
        <Footer></Footer>
      </div>
    </>
  );
}
