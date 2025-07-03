import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import placeholder from "../assets/placeholder.png";
import Notification from "./Notification";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showNotification, setShowNotification] = useState(false); 
  const [notificationMessage, setNotificationMessage] = useState(""); 

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
    setShowNotification(true); 

    console.log("Notification state set to true.");

    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage(""); // Clear message
   
      console.log("Notification hidden after timeout.");
     
    }, 3000); 
  };

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: "100px", height: "100px" }} />
      </h2>
    );
  }

  return (
    <>
      <Notification show={showNotification} message={notificationMessage} type="success" />
      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, available, imageUrl } = product;

            return (
                <div
                  className="card mb-3"
                  style={{
                    width: "250px",
                    height: "400px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: available ? "#fff" : "#ccc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                  }}
                  key={id}
                >
                <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={imageUrl}
                    alt={name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholder;
                    }}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      padding: "5px",
                      margin: "0",
                      borderRadius: "10px 10px 10px 10px",
                    }}
                  />
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i
                        className="card-brand"
                        style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                      >
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr className="hr-line" style={{ margin: "10px 0" }} />
                    <div className="home-cart-price">
                      <h5
                        className="card-text"
                        style={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: 'var(--color-primary)'
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{price}</span>
                      </h5>
                    </div>
                    <button
                      className="btn"
                      style={{
                        marginTop: 12,
                        background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                        letterSpacing: '0.5px',
                        transition: 'background 0.18s, box-shadow 0.18s',
                      }}
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