import "./Home.css";
import HeroSearch from "../../components/HeroSearch/HeroSearch";
import heroImg from "../../assets/images/home-bg10.jpg";
import HomeAbout from "../../components/HomeAbout/HomeAbout";
import HomeListings from "../../components/HomeListings/HomeListings";
import HomeTrust from "../../components/HomeTrust/HomeTrust";
import HomeFAQ from "../../components/HomeFAQ/HomeFAQ";
import HomeCTA from "../../components/HomeCTA/HomeCTA";

export default function Home() {
  return (
    <>
    <section className="home-hero" style={{ "--hero": `url(${heroImg})` }}>
      <div className="home-hero__overlay" />
      <div className="home-hero__content container">
        <h1 className="home-hero__title">Secure student housing <br /> before you land</h1>
        <p className="home-hero__subtitle">
          Every listing is verified, every payment protected — so you can arrive with peace of mind.
        </p>

        <div className="home-hero__searchwrap hb-searchwrap">
          <HeroSearch />
        </div>



      </div>
    </section>
    <HomeAbout/>
    <HomeListings/>
    <HomeTrust />
<HomeCTA />

<HomeFAQ />
    </>

  );
}
