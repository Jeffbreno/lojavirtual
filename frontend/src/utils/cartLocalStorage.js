export function saveCartLocal(cartItems) {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }
  
  export function loadCartLocal() {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  }
  
  export function clearCartLocal() {
    localStorage.removeItem("cart");
  }
  