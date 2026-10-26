import { useState } from "react";
import { Mail, Check, ArrowRight, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubscribed(true);
  };

  return (
    <section className="newsletter-section" aria-label="Join our community">
      <div className="newsletter-container">
        <div className="newsletter-card">
          <div className="newsletter-content">
            <span className="newsletter-badge">
              <Sparkles size={14} /> BOOK LOVERS CLUB
            </span>

            <h2>Read more. Grow faster. Stay inspired.</h2>

            <p>
              Join 40,000+ readers who receive our weekly editorial book picks,
              author essays, and member-only secret discounts.
            </p>

            {subscribed ? (
              <div className="newsletter-success">
                <div className="success-icon-wrap">
                  <Check size={20} />
                </div>
                <div>
                  <strong>You're on the list!</strong>
                  <p>Check your inbox for your 15% discount code: <code>READMORE</code></p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="newsletter-input-group">
                  <Mail size={18} className="mail-icon" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address for newsletter"
                  />
                  <button type="submit" className="newsletter-submit-btn">
                    <span>Subscribe</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <small className="newsletter-disclaimer">
                  No spam, ever. Unsubscribe with a single click anytime.
                </small>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
