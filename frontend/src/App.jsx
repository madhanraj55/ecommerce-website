import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  useEffect(() => {
    api.get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
      });
    api.get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

  }, []);
  const increaseQuantity = (productId) => {
    setQuantities((previous) => ({
      ...previous,
      [productId]: (previous[productId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities((previous) => ({
      ...previous,
      [productId]: Math.max((previous[productId] || 1) - 1, 1),
    }));
  };

  return (
    <div className="store">
      <header className="site-header">
        <div className="top-bar-container">
          <div className="top-bar">
            <div className="top-bar-left">
              <span>24*7 Available 💬 (+91) 8925087991</span>
            </div>
            <div className="top-bar-right">
              <span>📱 +91 89250 87991</span>
            </div>
          </div>
        </div>
        <div className="main-header">
          <div className="logo">
            <div className="logo-placeholder">
              <span className="logo-s">S</span>
              <div className="logo-text">
                <span className="logo-brand">saravana's</span>
                <span className="logo-crackers">CRACKERS</span>
              </div>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#" className="active">Home</a>
            <a href="#">About Us</a>
            <a href="#">Pricelist</a>
            <a href="#">Contact us</a>
          </nav>
          <div className="header-actions">
            <button className="download-btn">Download Pricelist</button>
          </div>
        </div>
      </header>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className="category-card"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.image ? (
              <img
                src={`http://127.0.0.1:8000/storage/${category.image}`}
                alt={category.name}
              />
            ) : (
              <div className="category-no-image">
                No Image
              </div>
            )}

            <span>{category.name}</span>
          </button>
        ))}
      </div>
      <main className="products-section">
        <h2>Our Products</h2>

        <div className="product-grid">
          {products
            .filter((product) => {
              const matchesSearch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category?.name
                  .toLowerCase()
                  .includes(search.toLowerCase());

              const matchesCategory =
                selectedCategory === null ||
                product.category_id === selectedCategory;

              return matchesSearch && matchesCategory;
            })
            .map((product) => (
              <div className="product-card" key={product.id}>

                {product.image ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${product.image}`}
                    alt={product.name}
                  />
                ) : (
                  <div className="no-image">
                    No Image
                  </div>
                )}

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p className="category">
                    {product.category?.name}
                  </p>

                  <div className="price">
                    <span className="original">
                      ₹{product.original_price}
                    </span>

                    <span className="selling">
                      ₹{product.selling_price}
                    </span>
                  </div>
                  <div className="quantity-total-row">
                    <div className="quantity-control">
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                      >
                        −
                      </button>

                      <span>
                        {quantities[product.id] || 1}
                      </span>

                      <button
                        onClick={() => increaseQuantity(product.id)}
                      >
                        +
                      </button>
                    </div>

                    <p className="product-total">
                      Total: ₹
                      {(
                        Number(product.selling_price) *
                        (quantities[product.id] || 1)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <button>
                    Add to Cart
                  </button>
                </div>

              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default App;