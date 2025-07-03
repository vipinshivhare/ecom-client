import React, { useState } from "react";
import axios from "axios";
import Notification from "./Notification";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    quantity: "",       
    releaseDate: "",     
    available: true,    
  });

  const [image, setImage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const fixedProduct = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
      available: Boolean(product.available),
      releaseDate: product.releaseDate ? product.releaseDate : null,
    };

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(fixedProduct)], { type: "application/json" })
    );

    axios
      .post("https://ecom-serverside.onrender.com/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setNotificationMessage("Product added successfully");
        setNotificationType("success");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch((error) => {
        setNotificationMessage("Error adding product");
        setNotificationType("error");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      });
  };

  return (
    <div className="container">
      <Notification show={showNotification} message={notificationMessage} type={notificationType} />
      <div className="center-container">
        <form className="row g-3 pt-5" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label"><h6>Name</h6></label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Brand</h6></label>
            <input
              type="text"
              className="form-control"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              placeholder="Enter your Brand"
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label"><h6>Description</h6></label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              placeholder="Add product description"
              required
            />
          </div>

          <div className="col-md-5">
            <label className="form-label"><h6>Price</h6></label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="Eg: 1000"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Category</h6></label>
            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label"><h6>Stock Quantity</h6></label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              placeholder="Stock Remaining"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label"><h6>Release Date</h6></label>
            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label"><h6>Image</h6></label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="available"
                checked={product.available}
                onChange={(e) =>
                  setProduct({ ...product, available: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn"
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
