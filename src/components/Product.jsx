import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import placeholder from "../assets/placeholder.png";
import Notification from "./Notification";


const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://ecom-serverside.onrender.com/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`https://ecom-serverside.onrender.com/api/product/${id}`);
      removeFromCart(id);
      setNotificationMessage("Product deleted successfully");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
        refreshData();
        navigate("/");
      }, 2000);
    } catch (error) {
      setNotificationMessage("Error deleting product");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handlAddToCart = () => {
    addToCart(product);
    setNotificationMessage(`${product.name} added to cart!`);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100vh !important;
          overflow: hidden !important;
        }
      `}</style>
      <Notification show={showNotification} message={notificationMessage} type="success" />
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--body_background)' }}>
        <div className="containers" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', width: '100%', maxWidth: 1100, margin: 0, padding: 0 }}>
          <div className="left-column" style={{ width: '50%', minWidth: 320, maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: '0 2vw' }}>
            <img
              className="product-detail-img"
              src={product.imageUrl || placeholder}
              alt={product.name}
              style={{
                width: '100%',
                maxWidth: '420px',
                maxHeight: '420px',
                objectFit: 'cover',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(37,99,235,0.10)',
                background: '#f1f5f9',
                position: 'static',
                opacity: 1,
                margin: 0,
                display: 'block',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
            />
          </div>
          <div className="right-column" style={{ width: '50%', minWidth: 320, maxWidth: 580, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2vw' }}>
            <div className="product-description" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '1.08rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '0.5px' }}>{product.category}</span>
                <span className="release-date" style={{ color: 'var(--color-info)', fontSize: '1rem', fontWeight: 500 }}>
                  <i>Listed: {new Date(product.releaseDate).toLocaleDateString()}</i>
                </span>
              </div>
              <h2 style={{ fontSize: '2.2rem', margin: '0 0 0.7rem 0', textTransform: 'capitalize', letterSpacing: '1.2px', color: 'var(--color-primary)', fontWeight: 800 }}>{product.name}</h2>
              <div className="card-brand" style={{ marginBottom: 16, fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>{product.brand}</div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: '12px 0 6px', color: 'var(--color-text)' }}>Description</p>
              <p style={{ marginBottom: '1.5rem', color: 'var(--color-text)', fontSize: 16, lineHeight: 1.7 }}>{product.description}</p>
            </div>
            <div className="product-price" style={{ margin: '0 0 1.2em 0', display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{`₹${product.price}`}</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: 17 }}>
                Stock: <i>{product.quantity}</i>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '1.5em 0 0.5em 0' }}>
              <button
                className={`cart-btn ${!product.available || product.quantity <= 0 ? "disabled-btn" : ""}`}
                onClick={handlAddToCart}
                disabled={!product.available || product.quantity <= 0}
                style={{
                  fontSize: '1.08rem',
                  padding: '12px 32px',
                  minWidth: 130,
                  borderRadius: 10,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  margin: 0,
                  background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                  transition: 'background 0.18s, box-shadow 0.18s',
                }}
              >
                {product.available && product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                type="button"
                onClick={handleEditClick}
                className="btn"
                style={{
                  minWidth: 100,
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                  transition: 'background 0.18s, box-shadow 0.18s',
                }}
              >
                Update
              </button>
              <button
                type="button"
                onClick={deleteProduct}
                className="btn"
                style={{
                  minWidth: 100,
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #34d399 0%, #ffe066 40%, #60a5fa 80%, #fb7185 100%)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                  transition: 'background 0.18s, box-shadow 0.18s',
                }}
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
