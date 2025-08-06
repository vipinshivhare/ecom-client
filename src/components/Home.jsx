import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import placeholder from "../assets/placeholder.png";
import AppNotification from "./AppNotification"; 
import '../styles/Home.css'

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
    setNotificationType("success"); // Set notification type
    setShowNotification(true); 

    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage(""); // Clear message
    }, 3000); 
  };

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: "100px", height: "100px" }} />
        <p style={{color: 'var(--para-clr)'}}>Error fetching data. Please try again later.</p> {/* Added text for error */}
      </h2>
    );
  }

  // Display loading message when data is being fetched
  if (isLoadingData) {
    return (
      <div className="text-center" style={{ padding: "18rem", color: 'var(--para-clr)' }}>
        loading..
      </div>
    );
  }

  return (
    <>
      <AppNotification show={showNotification} message={notificationMessage} type={notificationType} /> {/* Changed component name */}
      <div
        className="home-grid-container" // Changed class name to match new CSS
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="no-products-message" // Changed class name to match new CSS
          >
            Loading..
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, available, imageUrl } = product;

            return (
                <div
                  className={`product-card ${!available ? "out-of-stock" : ""}`} // Changed class name and added out-of-stock class
                  key={id}
                >
                <Link to={`/product/${id}`} className="product-card-link"> {/* Changed class name */}
                  <img
                    src={imageUrl}
                    alt={name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholder;
                    }}
                    className="product-card-image" // Changed class name
                  />
                  <div
                    className="product-card-body" // Changed class name
                  >
                    <div>
                      <h5
                        className="product-card-title" // Changed class name
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i
                        className="product-card-brand" // Changed class name
                      >
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr className="hr-line" />
                    <div className="home-cart-price">
                      <h5
                        className="product-card-price" // Changed class name
                      >
                        <span>₹{price}</span>
                      </h5>
                    </div>
                    <button
                      className="btn product-card-button" // Changed class name
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
