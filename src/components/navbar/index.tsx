import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import type { AuthContextType } from "../../contexts/AuthContext";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "", label: "Home" },
//   { id: "captions", label: "Captions" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const CreditsDisplay: React.FC = () => {
  const context = useContext(AuthContext) as AuthContextType | undefined;
  const user = context?.user;
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        console.log("Fetching credits...");
        const response = await axios.get("https://api.freezygig.com/api/auth/user/credits", {
          withCredentials: true,
        });
        console.log("Credits response:", response);
        console.log("Credits data:", response.data);
        setCredits(response.data.credits);
        console.log("Credits fetch failed with status:", response.status);
      } catch (err) {
        console.error("Error fetching credits:", err);
        setCredits(null);
      }
    };
    if (user) {
      fetchCredits();
    }
  }, [user]);

  if (!user) return null;

  return <div>Credits: {credits !== null ? credits : "Loading..."}</div>;
};

const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleTabClick = (id: string) => {
    navigate(`/${id}`);
    setActiveTab(id);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <ul className="navbar-tabs">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`navbar-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
              <span className="underline" />
            </li>
          ))}
        </ul>
        <CreditsDisplay />
      </div>
    </nav>
  );
};

export default Navbar;
