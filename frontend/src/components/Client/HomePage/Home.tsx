import Banner from "../../../layout/Client/Banner";
import NewProduct from "./sections/NewProduct";
import CategorySection from "./sections/CategorySection";
import BestSelling from "./sections/BestSelling";
import OtherProduct from "./sections/OtherProduct";


const Home = () => {
  return (
    <>
      <Banner />
      <CategorySection />
      <BestSelling />
      <NewProduct />
      <OtherProduct />
    </>
  );
};

export default Home;
