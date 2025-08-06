import React from 'react';
import { Modal } from 'react-bootstrap';
import '../styles/CheckoutPopup.css';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout, isLoading }) => {
  return (
    <div className="checkoutPopup">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div>
                  <b><p>{item.name}</p></b>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="total-price-display">
              <h5>Total: ₹{totalPrice}</h5>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn"
            onClick={handleClose}
            disabled={isLoading}
          >
            Close
          </button>
          <button
            className="btn"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Confirming..." : "Confirm Purchase"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;