import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import placeholder from "../assets/placeholder.png";
import AppNotification from "./AppNotification";
import '../styles/Home.css';

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData, isLoadingData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const updatedProducts = data.map((product) => ({
        ...product,
        imageUrl: product.imageUrl || placeholder,
      }));
      setProducts(updatedProducts);
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotificationMessage(`${product.name} added to cart!`);
    setNotificationType("success");
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: "100px", height: "100px" }} />
        <p style={{color: 'var(--para-clr)'}}>Error fetching data. Please try again later.</p>
      </h2>
    );
  }

  if (isLoadingData) {
    return (
      <div className="text-center" style={{ padding: "18rem", color: 'var(--para-clr)' }}>
        <h2>Fetching data from backend, it's a free server so it's taking time.</h2>
        <h3>Thank you for your patience.</h3>
      </div>
    );
  }

  return (
    <>
      <AppNotification show={showNotification} message={notificationMessage} type={notificationType} />
      <div className="home-grid-container">
        {filteredProducts.length === 0 ? (
          <h2 className="no-products-message">No Products Available</h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, available, imageUrl } = product;

            return (
                <div
                  className={`product-card ${!available ? "out-of-stock" : ""}`}
                  key={id}
                >
                <Link to={`/product/${id}`} className="product-card-link">
                  <img
                    src={imageUrl}
                    alt={name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholder;
                    }}
                    className="product-card-image"
                  />
                  <div className="product-card-body">
                    <div>
                      <h5 className="product-card-title">
                        {name.toUpperCase()}
                      </h5>
                      <i className="product-card-brand">
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr className="hr-line" />
                    <div className="home-cart-price">
                      <h5 className="product-card-price">
                        <span>₹{price}</span>
                      </h5>
                    </div>
                    <button
                      className="btn product-card-button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (available) handleAddToCart(product);
                      }}
                      disabled={!available}
                    >
                      {available ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;