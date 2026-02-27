import React, { useContext } from "react";
import { apiRequest } from "../api";
import { useLocation } from "react-router-dom";
import UserContext from "../UserContext";

function OrderPage() {
  const { currentUser, homeAddress, billingAddress, setCart } = useContext(UserContext);
    const [thankYou, setThankYou] = React.useState(false);
  const location = useLocation();
  const cart = location && location.state && location.state.cart ? location.state.cart : [];

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      {thankYou ? (
        <div>
          <h1>Thank you for your purchase!</h1>
          <p>This page is a work in progress.  We are unable to process your order at this time without a payment processor being integrated.</p>
          <p>In the meantime, your cart has been cleared.</p>
        </div>
      ) : (
        <div>
          <h1>Confirm Your Order</h1>
          <h2>Contact Information</h2>
          <div><b>Username:</b> {currentUser?.username}</div>
          <div><b>Email:</b> {currentUser?.email}</div>
          <div><b>Phone:</b> {currentUser?.phone}</div>
          <h2>Shipping Address</h2>
          <div><b>Street:</b> {homeAddress?.street}</div>
          <div><b>City:</b> {homeAddress?.city}</div>
          <div><b>State:</b> {homeAddress?.state}</div>
          <div><b>Postal Code:</b> {homeAddress?.postal_code}</div>
          <div><b>Country:</b> {homeAddress?.country}</div>
          <h2>Billing Address</h2>
          <div><b>Street:</b> {billingAddress?.street}</div>
          <div><b>City:</b> {billingAddress?.city}</div>
          <div><b>State:</b> {billingAddress?.state}</div>
          <div><b>Postal Code:</b> {billingAddress?.postal_code}</div>
          <div><b>Country:</b> {billingAddress?.country}</div>
          <h2>Order Summary</h2>
          <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 16 }}>
            {cart && cart.length > 0 ? cart.map(item => (
              <li key={item.id} style={{ marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{item.name}</span> - Qty: {item.quantity} - Price: ${Number(item.price).toFixed(2)}
              </li>
            )) : <li>No items in cart.</li>}
          </ul>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 16 }}>
              Final Total: ${cart && cart.length > 0 ? cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2) : "0.00"}
          </div>
          <button
            style={{ marginTop: 24, width: "100%", padding: 12, background: "#4caf50", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, fontSize: "1.1rem" }}
            onClick={async () => {
              if (currentUser && cart.length > 0) {
                for (const item of cart) {
                  await apiRequest(`/shopping_cart_items/${currentUser.username}/${item.id}`, { method: "delete" });
                }
              }
              setThankYou(true);
            }}
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
