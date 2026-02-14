import "./Landing.css";

import image from "../../assets/images/image.png";



import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth(); // 🔐 check login

  const handleFindCourt = () => {
    if (user) {
      
      navigate("/courts");
      console.log(user)
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="landing">
      {/* LEFT CONTENT */}
      <div className="landing-content">
        <h1 className="landing-title">
          BOOK COURTS <br />
          IN PES UNIVERSITY (RR CAMPUS)
        </h1>

        <p className="landing-subtitle">
          Access real-time availability and book with ease.
        </p>

        <button className="landing-btn" onClick={handleFindCourt}>
          Find a court
          <span className="arrow">↗</span>
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="landing-image">
        <img src={image} />
      </div>
    </section>
  );
}
