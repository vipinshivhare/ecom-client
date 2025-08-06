import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  return (
    <div className="checkoutPopup">
   
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item" style={{ display: 'flex', marginBottom: '10px' }}>
              <img 
                src={item.imageUrl} // This should be the Cloudinary URL
                alt={item.name} 
                className="cart-item-image" 
                style={{ width: '150px', marginRight: '10px' }} 
              />
              <div>
                <b><p>{item.name}</p></b>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <div >
            <h5 style={{color:'black' , display:'flex',justifyContent:'center',fontSize:'1.3rem', fontWeight:'bold'}} >Total: ₹{totalPrice}</h5>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn"
          style={{
            background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            padding: '10px 28px',
            minWidth: 120,
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            transition: 'background 0.18s, box-shadow 0.18s',
          }}
          onClick={handleClose}
        >
          Close
        </button>
        <button
          className="btn"
          style={{
            background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            padding: '10px 28px',
            minWidth: 120,
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            transition: 'background 0.18s, box-shadow 0.18s',
          }}
          onClick={handleCheckout}
        >
          Confirm Purchase
        </button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default CheckoutPopup;
