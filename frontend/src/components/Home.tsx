// import { JSX, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Carousel from "./Carousel";
// import Services from "./Services";
// import Contact from "./Contact";
// import Footer from "./Footer";
// import Video from "./video";
// import Schedulebutton from "./Schedulebuttom";
// import MapSection from "./GetInTouch";
// import GetAQuote from "./getaquote";
// import Schedule from "./Schedule";
// import SEO from "./SEO";
// import MeetTheTechnician from "./MeetTheTechnician";
// import GoogleReviews from "./GoogleReviews";
// import BlogPreview from "./BlogPreview";

// type Section = "home" | "services" | "contact" | "quote" | "schedule";

// function Home(): JSX.Element {
//   const [activeSection, setActiveSection] = useState<Section>("home");
//   const navigate = useNavigate();

//   return (
//     <main className="min-h-screen bg-white">
//       <SEO />
//       {/* Home Section */}
//       {activeSection === "home" && (
//         <div>
//           <div id="home-section">
//             <Carousel />
//           </div>
//           <div style={{ marginBottom: "3rem" }}>
//             <Schedulebutton onClick={() => setActiveSection("schedule")} onSeniorTechClick={() => navigate("/senior-tech-service")} />
//           </div>
//           <div id="services-section" style={{ marginTop: "2rem" }}>
//             <Services />
//           </div>
//           <section>
//             <h2 style={{ textAlign: "center", color: "white" }}>
//               How our services work
//             </h2>
//             <hr
//               style={{
//                 width: "200px",
//                 margin: "0 auto 20px",
//                 borderColor: "white",
//               }}
//             />
//             <Video />
//           </section>
//           <GoogleReviews />
//           <MeetTheTechnician />
//           <BlogPreview />
//           <div>
//             <MapSection />
//           </div>
//           <div>
//             <Footer />
//           </div>
//         </div>
//       )}

//       {/* Services Section */}
//       {activeSection === "services" && (
//         <div className="pt-20">
//           <Services />
//           <Video src="https://www.youtube.com/watch?v=saZuQhPeVqU" />
//           <Footer />
//         </div>
//       )}

//       {/* Contact Section */}
//       {activeSection === "contact" && (
//         <div className="pt-20">
//           <Contact />
//         </div>
//       )}

//       {/* Get A Quote Section */}
//       {activeSection === "quote" && (
//         <div className="pt-20">
//           <GetAQuote />
//         </div>
//       )}

//       {/* Schedule Section */}
//       {activeSection === "schedule" && (
//         <div className="pt-20">
//           <Schedule />
//           <Footer />
//         </div>
//       )}
//     </main>
//   );
// }

// export default Home;

import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import Services from "./Services";
import Contact from "./Contact";
import Footer from "./Footer";
import Video from "./video";
import Schedulebutton from "./Schedulebuttom";
import MapSection from "./GetInTouch";
import GetAQuote from "./getaquote";
import Schedule from "./Schedule";
import SEO from "./SEO";
import MeetTheTechnician from "./MeetTheTechnician";
import GoogleReviews from "./GoogleReviews";
import BlogPreview from "./BlogPreview";
import HeroSEO from "./HeroSEO"; // ✅ NEW
import SEOSections from "./SEOSections"; // ✅ NEW

type Section = "home" | "services" | "contact" | "quote" | "schedule";

function Home(): JSX.Element {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white">
      <SEO />

      {/* Home Section */}
      {activeSection === "home" && (
        <div>
          {/* ✅ NEW: SEO Hero replaces/supplements the Carousel hero text */}
          <HeroSEO />

          {/* Original Carousel (keep for when images are uploaded) */}
          <div id="home-section" style={{ display: "none" }}>
            <Carousel />
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <Schedulebutton
              onClick={() => setActiveSection("schedule")}
              onSeniorTechClick={() => navigate("/senior-tech-service")}
            />
          </div>

          {/* Original Services component */}
          <div id="services-section" style={{ marginTop: "2rem" }}>
            <Services />
          </div>

          {/* How our services work video */}
          <section>
            <h2 style={{ textAlign: "center", color: "white" }}>
              How our services work
            </h2>
            <hr
              style={{
                width: "200px",
                margin: "0 auto 20px",
                borderColor: "white",
              }}
            />
            <Video />
          </section>

          {/* ✅ NEW: Full SEO content — Why Us, Services detail, How It Works, Coverage, FAQ, CTA */}
          <SEOSections />

          <GoogleReviews />
          <MeetTheTechnician />
          <BlogPreview />

          <div>
            <MapSection />
          </div>
          <div>
            <Footer />
          </div>
        </div>
      )}

      {/* Services Section */}
      {activeSection === "services" && (
        <div className="pt-20">
          <Services />
          <Video src="https://www.youtube.com/watch?v=saZuQhPeVqU" />
          <Footer />
        </div>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <div className="pt-20">
          <Contact />
        </div>
      )}

      {/* Get A Quote Section */}
      {activeSection === "quote" && (
        <div className="pt-20">
          <GetAQuote />
        </div>
      )}

      {/* Schedule Section */}
      {activeSection === "schedule" && (
        <div className="pt-20">
          <Schedule />
          <Footer />
        </div>
      )}
    </main>
  );
}

export default Home;
