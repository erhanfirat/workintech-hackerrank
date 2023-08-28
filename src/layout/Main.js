import Footer from "./Footer";
import Header from "./Header";
import PageBody from "./PageBody";
import SideBar from "./SideBar";

const Main = () => {
  return (
    <div className="d-flex flex-column " style={{ minHeight: "100vh" }}>
      <Header />
      <div className="d-flex flex-grow-1">
        <SideBar />
        <PageBody />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
