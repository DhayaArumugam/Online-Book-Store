import { useContext } from "react";
import {
  CartContext,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "./cartContextInstance";

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}

export { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE };
