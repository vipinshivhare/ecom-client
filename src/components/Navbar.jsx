import React, { useEffect, useState } from "react";
import Home from "./Home"
import axios from "axios";
import '../styles/Navbar.css';

const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("https://ecom-serverside.onrender.com/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
    try {
      const response = await axios.get(
        `https://ecom-serverside.onrender.com/api/products/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

 

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top" style={{
          background: 'linear-gradient(90deg, rgba(52,211,153,0.85) 0%, rgba(255,224,102,0.85) 30%, rgba(96,165,250,0.85) 65%, rgba(251,113,133,0.85) 100%)',
          boxShadow: '0 2px 16px rgba(37,99,235,0.07)',
          borderBottom: '1.5px solid #ffe066',
          padding: '0.7em 2em',
          zIndex: 100,
          width: '100%',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}>
          <div className="container-fluid" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <a className="navbar-brand" href="https://portfolio-vipin-shivhare.netlify.app/" style={{
              color: '#047857',
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '1px',
              textShadow: '0 1px 8px #fffbe7',
            }}>
              KnowMe
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ border: 'none', background: 'transparent', fontSize: '1.5rem' }}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/" style={{ color: '#047857', fontWeight: 600 }}>
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add_product" style={{ color: '#b91c1c', fontWeight: 600 }}>
                    Add Product
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#2563eb', fontWeight: 600 }}>
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button className="dropdown-item" onClick={() => handleCategorySelect(category)} style={{ color: '#047857', fontWeight: 600 }}>
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              <button className="theme-btn" onClick={() => toggleTheme()} style={{
                background: '#60a5fa',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>
              <div className="d-flex align-items-center cart" style={{ position: 'relative' }}>
                <a href="/cart" className="nav-link text-dark" style={{ position: 'relative', color: '#b91c1c', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <i className="bi bi-cart me-2" style={{ fontSize: '2.1rem', verticalAlign: 'middle', color: '#047857', textShadow: '0 1px 8px #fffbe7' }}>
                    {/* Cart icon */}
                  </i>
                  <span style={{
                    position: 'absolute',
                    top: -6,
                    right: -10,
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 7px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.12)',
                  }}>
                    {/* TODO: Replace with cart count */}1
                  </span>
                </a>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    border: '1.5px solid #60a5fa',
                    borderRadius: '12px',
                    padding: '0.5em 1em',
                    marginLeft: 16,
                    minWidth: 180,
                    background: '#fff',
                    color: '#047857',
                    boxShadow: '0 2px 8px rgba(96,165,250,0.04)',
                    transition: 'border 0.18s, box-shadow 0.18s',
                  }}
                />
                {showSearchResults && (
                  <ul className="list-group" style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    width: '100%',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(96,165,250,0.10)',
                    zIndex: 10,
                    marginTop: 4,
                    padding: 0,
                    listStyle: 'none',
                  }}>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item" style={{
                          padding: '0.7em 1em',
                          borderBottom: '1px solid #60a5fa',
                          color: '#047857',
                        }}>
                          <a href={`/product/${result.id}`} className="search-result-link" style={{ color: '#b91c1c' }}>
                            <span>{result.name}</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <p className="no-results-message" style={{ color: '#ef4444', padding: '0.7em 1em' }}>
                          No Product with such Name
                        </p>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
