import { Truck, ShieldCheck, RotateCcw, Lock } from "lucide-react";

export default function FeaturesBanner() {
  const features = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      description: "Orders over ₹499 dispatched within 24 hours.",
    },
    {
      icon: ShieldCheck,
      title: "100% Genuine Editions",
      description: "Direct publisher prints with pristine book covers.",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Returns",
      description: "No-questions-asked replacement or refund guarantee.",
    },
    {
      icon: Lock,
      title: "Secure 256-bit Checkout",
      description: "Encrypted transactions via UPI, Cards, and Net Banking.",
    },
  ];

  return (
    <section className="features-banner" aria-label="Store guarantees">
      <div className="features-grid">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="feature-card">
              <div className="feature-icon-box">
                <Icon size={22} />
              </div>
              <div className="feature-text">
                <h4 className="feature-title">{item.title}</h4>
                <p className="feature-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
