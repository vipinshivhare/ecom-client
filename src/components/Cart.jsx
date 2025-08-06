import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import AppNotification from "./AppNotification";
import placeholder from "../assets/placeholder.png";
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart, data } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

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
          setNotificationType("info");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 1500);
          return { ...item, quantity: item.quantity + 1 };
        } else {
          setNotificationMessage("Cannot add more than available stock");
          setNotificationType("warning");
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
    setNotificationType("info");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1500);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const updated = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updated);
    setNotificationMessage("Item removed from cart");
    setNotificationType("error");
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
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
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (error) {
      setNotificationMessage("Checkout failed!");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      console.error("Checkout failed →", error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppNotification show={showNotification} message={notificationMessage} type={notificationType} />
      <div className="cart-container">
        <div className="shopping-cart">
          <div className="title">Shopping Bag</div>
          {cartItems.length === 0 ? (
            <div className="empty">
              <h4>Your cart is empty</h4>
            </div>
          ) : (
            <>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="item">
                      <div>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="cart-item-image"
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
              </ul>
              <div className="total">Total: ₹{totalPrice}</div>
              <div className="checkout-button">
                <button
                  className="btn"
                  onClick={() => setShowModal(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
        <CheckoutPopup
          show={showModal}
          handleClose={() => setShowModal(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
          handleCheckout={handleCheckout}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Cart;