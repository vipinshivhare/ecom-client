# E-Commerce Frontend

This is a modern React-based frontend for an E-Commerce platform, featuring product browsing, cart, checkout, and admin product management. It is designed to work with the backend API deployed at [https://ecom-serverside.onrender.com](https://ecom-serverside.onrender.com).

Live Demo: [https://ecom-java.netlify.app](https://ecom-java.netlify.app)

---

## Features
- Browse products by category
- Add to cart, update cart, and checkout
- Product details with image, description, price, and stock
- Admin: Add, update, and delete products
- Modern notification popups for all actions
- Responsive, clean UI

---

## Tech Stack
- **Frontend:** React, Vite, Bootstrap, Axios
- **Backend:** [See backend repo / API](https://ecom-serverside.onrender.com)

---

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ecom-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build for Production
```bash
npm run build
```
The production build will be in the `dist/` folder.
```

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Deploying to Netlify
1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Publish directory:** `dist`
3. **Build command:** `npm run build`
4. **React Router support:** Add a `_redirects` file to `public/` with:
   ```
   /*    /index.html   200
   ```
5. **Connect to Netlify** and deploy. See [Live Demo](https://ecom-java.netlify.app).

---

## Environment & API
- The frontend is configured to use the backend at `https://ecom-serverside.onrender.com/api`.
- If you want to use a different backend, update `src/axios.jsx`.

---

## Folder Structure
```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── Context/
│   ├── App.jsx
│   ├── main.jsx
│   └── axios.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## Screenshots
> Add screenshots of your app here for a better README!

---

## License
This project is open source and free to use.
