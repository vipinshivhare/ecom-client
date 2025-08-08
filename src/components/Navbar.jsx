import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import '../styles/Navbar.css';

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navRef = useRef(null);      // ref for the collapsible menu
  const togglerRef = useRef(null);  // ref for the hamburger button

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Robust closeMenu: uses Bootstrap's API if available, otherwise fallback
  const closeMenu = () => {
    const nav = navRef.current;
    if (!nav) return;

    // If Bootstrap JS is loaded, use its Collapse API (preferred)
    if (window.bootstrap && typeof window.bootstrap.Collapse === "function") {
      // try to get an existing instance, otherwise create one (toggle: false)
      const instance = window.bootstrap.Collapse.getInstance(nav) || new window.bootstrap.Collapse(nav, { toggle: false });
      instance.hide();
    } else {
      // fallback: remove show class and update toggler aria-expanded
      nav.classList.remove("show");
      if (togglerRef.current) {
        togglerRef.current.setAttribute("aria-expanded", "false");
      }
    }
  };

  // Close when clicking outside the menu, or when pressing Escape
  useEffect(() => {
    const handleOutside = (e) => {
      const nav = navRef.current;
      const toggler = togglerRef.current;
      if (!nav) return;

      const isOpen = nav.classList.contains("show");
      if (!isOpen) return; // nothing to do

      // if click/touch is inside nav OR on the toggler — ignore
      if (nav.contains(e.target) || (toggler && toggler.contains(e.target))) {
        return;
      }

      // else close the menu
      closeMenu();
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []); // run once

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `https://ecom-serverside.onrender.com/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
        setNoResults(true);
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
    closeMenu();
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
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid navbar-container">
            {/* Brand */}
            <Link className="navbar-brand" to="/" onClick={closeMenu}>KnowMe</Link>

            {/* Cart (always visible) */}
            <div className="navbar-right-fixed-icons">
              <Link to="/cart" className="nav-link text-dark cart-icon-container" onClick={closeMenu}>
                <i className="bi bi-cart me-2 cart-icon" />
                <span className="cart-count">{cartItemCount}</span>
              </Link>
            </div>

            {/* Hamburger toggler */}
            <button
              ref={togglerRef}
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            {/* Collapsible content */}
            <div ref={navRef} className="collapse navbar-collapse" id="navbarSupportedContent">
              {/* Left nav links */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" to="/" onClick={closeMenu}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add_product" onClick={closeMenu}>Add Product</Link>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#!"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>

              {/* Right-side: theme + search */}
              <div className="navbar-right-icons">
                <button className="theme-btn" onClick={toggleTheme}>
                  {theme === "dark-theme" ? <i className="bi bi-moon-fill" /> : <i className="bi bi-sun-fill" />}
                </button>

                <input
                  className="form-control me-2 search-input"
                  type="search"
                  placeholder="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 100)}
                />

                {showSearchResults && (
                  <ul className="list-group search-results-dropdown">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item search-results-item">
                          <Link
                            to={`/product/${result.id}`}
                            className="search-result-link"
                            onClick={closeMenu}
                          >
                            {result.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      noResults && <p className="no-results-message">No Product with such Name</p>
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
