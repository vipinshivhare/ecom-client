import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import placeholder from "../assets/placeholder.png";
import AppNotification from "./AppNotification";
import '../styles/Product.css';

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://ecom-serverside.onrender.com/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotificationMessage("Error fetching product details.");
        setNotificationType("error");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`https://ecom-serverside.onrender.com/api/product/${id}`);
      removeFromCart(id);
      setNotificationMessage("Product deleted successfully");
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
        refreshData();
        navigate("/");
      }, 2000);
    } catch (error) {
      setNotificationMessage("Error deleting product");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    setNotificationMessage(`${product.name} added to cart!`);
    setNotificationType("success");
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="text-center" style={{ padding: "18rem", color: 'var(--para-clr)' }}>
        <h2>Fetching data from backend, it's a free server so it's taking time.</h2>
        <h3>Thank you for your patience.</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center" style={{ padding: "10rem", color: 'var(--para-clr)' }}>
        <h2>Product not found or an error occurred.</h2>
      </div>
    );
  }

  return (
    <>
      <AppNotification show={showNotification} message={notificationMessage} type={notificationType} />
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-left-column">
            <img
              className="product-detail-img"
              src={product.imageUrl || placeholder}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
            />
          </div>
          <div className="product-right-column">
            <div className="product-description-section">
              <div className="product-category-date">
                <span className="product-category">{product.category}</span>
                <span className="release-date">
                  <i>Listed: {new Date(product.releaseDate).toLocaleDateString()}</i>
                </span>
              </div>
              <h2 className="product-name">{product.name}</h2>
              <div className="product-brand">{product.brand}</div>
              <p className="product-description-heading">Description</p>
              <p className="product-description-text">{product.description}</p>
            </div>
            <div className="product-price-stock">
              <span className="product-price">{`₹${product.price}`}</span>
              <span className="product-stock">
                Stock: <i>{product.quantity}</i>
              </span>
            </div>
            <div className="product-actions">
              <button
                className="btn"
                onClick={handlAddToCart}
                disabled={!product.available || product.quantity <= 0 || isLoading}
              >
                {product.available && product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                type="button"
                onClick={handleEditClick}
                className="btn"
                disabled={isLoading}
              >
                Update
              </button>
              <button
                type="button"
                onClick={deleteProduct}
                className="btn"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;