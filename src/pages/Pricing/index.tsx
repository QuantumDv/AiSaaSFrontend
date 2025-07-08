import React from "react";
import Navbar from "../../components/navbar";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const plans = [
  {
    credits: 2,
    price: 5,
    label: "Starter",
    description: "Perfect for trying out caption generation.",
  },
  {
    credits: 5,
    price: 10,
    label: "Value",
    description: "Best for casual users who need more captions.",
    popular: true,
  },
  {
    credits: 15,
    price: 25,
    label: "Pro",
    description: "For power users who generate captions frequently.",
  },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const handlePurchase = (plan: typeof plans[0]) => {
    navigate("/payment", { state: { plan } });
  };
  return (
    <div className="pricing-page">
      <Navbar />
      <h1 className="pricing-title">Buy Credits</h1>
      <p className="pricing-subtitle">Purchase credits to generate captions. Choose the plan that fits your needs!</p>
      <div className="pricing-cards">
        {plans.map((plan) => (
          <div key={plan.credits} className={`pricing-card${plan.popular ? " popular" : ""}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h2 className="plan-label">{plan.label}</h2>
            <div className="plan-credits">{plan.credits} Credits</div>
            <div className="plan-price">Rs. {plan.price}</div>
            <p className="plan-description">{plan.description}</p>
            <button className="purchase-btn" onClick={() => handlePurchase(plan)}>
              Purchase
            </button>
          </div>
        ))}
      </div>
      <p className="pricing-note">* Credits are used for caption generation. 2 credits are required per caption.</p>
    </div>
  );
};

export default Pricing; 