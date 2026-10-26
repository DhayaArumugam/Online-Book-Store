
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookList from "../components/BookList";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <Hero />

        <section id="books">
          <BookList />
        </section>

        <section id="cart">
          <Cart />
        </section>

        <section id="checkout">
          <Checkout />
        </section>
      </main>
    </div>
  );
}
