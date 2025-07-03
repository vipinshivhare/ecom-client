import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import Notification from "./Notification";

const Cart = () => {
  const { cart, removeFromCart, clearCart, data } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const updateCartItemsWithImageUrl = () => {
      const updatedCartItems = cart.map((item) => ({
        ...item,
        imageUrl: item.imageUrl || item.imageName || placeholder,
      }));
      setCartItems(updatedCartItems);
    };

    updateCartItemsWithImageUrl();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        const originalProduct = data.find((p) => p.id === itemId);
        if (originalProduct && item.quantity < originalProduct.quantity) {
          setNotificationMessage("Quantity increased");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 1500);
          return { ...item, quantity: item.quantity + 1 };
        } else {
          setNotificationMessage("Cannot add more than available stock");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 2000);
        }
      }
      return item;
    });
    setCartItems(updated);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updated = cartItems
      .map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updated);
    setNotificationMessage("Quantity decreased");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1500);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const updated = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updated);
    setNotificationMessage("Item removed from cart");
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const originalProduct = data.find((p) => p.id === item.id);
        if (!originalProduct) continue;

        const remainingStock = originalProduct.quantity - item.quantity;

        const updatedProduct = {
          id: item.id,
          name: item.name,
          description: item.description,
          brand: item.brand,
          price: Number(item.price),
          category: item.category,
          releaseDate: new Date(item.releaseDate).toISOString().split("T")[0],
          available: remainingStock > 0,
          quantity: remainingStock,
          imageUrl: item.imageUrl,
        };

        const formData = new FormData();
        formData.append(
          "product",
          new Blob([JSON.stringify(updatedProduct)], {
            type: "application/json",
          })
        );

        await axios.put(`/product/${item.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
      setNotificationMessage("Order placed successfully!");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (error) {
      setNotificationMessage("Checkout failed!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      console.error("Checkout failed →", error?.response?.data || error.message);
    }
  };

  return (
    <>
      <Notification show={showNotification} message={notificationMessage} type="success" />
      <div className="cart-container">
        <div className="shopping-cart">
          <div className="title">Shopping Bag</div>
          {cartItems.length === 0 ? (
            <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
              <h4>Your cart is empty</h4>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="item" style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="cart-item-image"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="description">
                      <span>{item.brand}</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="quantity">
                      <button className="plus-btn" onClick={() => handleIncreaseQuantity(item.id)}>
                        +
                      </button>
                      <input type="button" value={item.quantity} readOnly />
                      <button className="minus-btn" onClick={() => handleDecreaseQuantity(item.id)}>
                        -
                      </button>
                    </div>
                    <div className="total-price">₹{item.price * item.quantity}</div>
                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
              <div className="total">Total: ₹{totalPrice}</div>
              <button
                className="btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 20,
                  padding: '14px 0',
                  marginTop: 18,
                  boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                  transition: 'background 0.18s, box-shadow 0.18s',
                }}
                onClick={() => setShowModal(true)}
              >
                Checkout
              </button>
            </>
          )}
        </div>
        <CheckoutPopup
          show={showModal}
          handleClose={() => setShowModal(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
          handleCheckout={handleCheckout}
        />
      </div>
    </>
  );
};

export default Cart;
