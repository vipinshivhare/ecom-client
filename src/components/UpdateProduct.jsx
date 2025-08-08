import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppNotification from "./AppNotification";
import '../styles/UpdateProduct.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    available: false,
    quantity: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/product/${id}`
        );
        setProduct(response.data);
        
        setUpdateProduct({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          brand: response.data.brand,
          price: Number(response.data.price),
          category: response.data.category,
          releaseDate: response.data.releaseDate ? new Date(response.data.releaseDate).toISOString().split('T')[0] : '',
          available: response.data.available,
          quantity: Number(response.data.quantity),
        });

        const responseImage = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = new File([responseImage.data], response.data.imageName || "product_image.jpg", { type: responseImage.data.type });
        setImage(imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotificationMessage("Error loading product for update.");
        setNotificationType("error");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedProductData = {
      ...updateProduct,
      price: Number(updateProduct.price),
      quantity: Number(updateProduct.quantity),
      available: Boolean(updateProduct.available),
      releaseDate: updateProduct.releaseDate ? updateProduct.releaseDate : null,
    };

    const formData = new FormData();
    if (image) {
      formData.append("imageFile", image);
    }
    formData.append(
      "product",
      new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
    );

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNotificationMessage("Product updated successfully!");
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate(`/product/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      setNotificationMessage("Failed to update product. Please try again.");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  if (isLoading) {
    return (
      <div className="text-center" style={{ padding: "18rem", color: 'var(--para-clr)' }}>
        <h2>Fetching data from backend, it's a free server so it's taking time.</h2>
        <h3>Thank you for your patience.</h3>
      </div>
    );
  }

  return (
    <div className="update-product-page-container">
      <AppNotification show={showNotification} message={notificationMessage} type={notificationType} />
      <div className="update-product-center-container">
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Brand"
              value={updateProduct.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Description"
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
              required
            />
          </div>
          <div className="col-md-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              value={updateProduct.price}
              placeholder="Eg: 1000"
              name="price"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category}
              onChange={handleChange}
              name="category"
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
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              placeholder="Stock Remaining"
              value={updateProduct.quantity}
              name="quantity"
              required
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Product Preview"
                className="product-image-preview"
              />
            )}
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              name="imageFile"
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="available"
                checked={updateProduct.available}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, available: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Updating..." : "Submit Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;