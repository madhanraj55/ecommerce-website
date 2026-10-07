import { useEffect, useState, useRef } from "react";
import api from "./api";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [addingProduct, setAddingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const holdTimerRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product) => {
    const qtyToAdd = quantities[product.id] || 1;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prevCart, { product, quantity: qtyToAdd }];
    });
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    setAddingProduct(product.id);
    setTimeout(() => setAddingProduct(null), 800);
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.product.selling_price) * item.quantity, 0);
  const categoriesRef = useRef(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const navigateToCollections = () => {
    setCurrentPage('home');
    setTimeout(() => {
      document.querySelector('.collection-title')?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = 300; // Scroll by about two cards
      categoriesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBackspaceDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setSearch("");
      holdTimerRef.current = null;
    }, 500);
  };

  const handleBackspaceUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      setSearch((prev) => prev.slice(0, -1));
    }
  };

  const handleBackspaceLeave = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

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
              <a href="mailto:2001madhanraj@gmail.com"> ✉ 2001madhanraj@gmail.com </a>
            </div>
            <div className="top-bar-right">
              <a href="tel:+919677676898"> ☎ +919677676898</a>
            </div>
          </div>
        </div>
        <div className="main-header">
          <div className="logo">
            <div className="logo-placeholder">
              <span className="logo-s">M</span>
              <div className="logo-text">
                <span className="logo-brand">Madhan</span>
                <span className="logo-crackers">CRACKERS</span>
              </div>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#" className={currentPage === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToCollections(); }}>Collections</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Price List</a>
            <a href="#" className={`safety-tips-link ${currentPage === 'safety' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('safety'); }}>Safety Tips</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Contact Us</a>  
            <a href="#" className="about-us-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>About Us</a>
            <a href="#" className={`cart-icon-link ${currentPage === 'cart' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('cart'); }}>
              🛒
              {cart.length > 0 && <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
            </a>
          </nav>
        </div>
      </header>
      {currentPage === 'home' && (
        <>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="backspace-btn"
            onMouseDown={handleBackspaceDown}
            onMouseUp={handleBackspaceUp}
            onMouseLeave={handleBackspaceLeave}
            onTouchStart={handleBackspaceDown}
            onTouchEnd={handleBackspaceUp}
            title="Click to delete 1 letter, hold to clear all"
          >
            ⌫
          </button>
        )}
      </div>
      <h1 className="collection-title">Collections</h1>
      <div className="categories-container">
        <button className="scroll-btn left" onClick={() => scrollCategories('left')}>‹</button>

        <div className="categories" ref={categoriesRef}>
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

        <button className="scroll-btn right" onClick={() => scrollCategories('right')}>›</button>
      </div>
      <main className="products-section">
        <h2>Products</h2>

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

                  <button 
                    className={`add-to-cart-btn ${addingProduct === product.id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addingProduct === product.id ? 'Added! ✓' : 'Add to Cart'}
                  </button>
                </div>

              </div>
            ))}
        </div>
      </main>
      </>
      )}

      {currentPage === 'cart' && (
        <div className="cart-page">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is currently empty.</p>
          ) : (
            <div className="cart-container">
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div className="cart-item" key={item.product.id}>
                    {item.product.image ? (
                      <img src={`http://127.0.0.1:8000/storage/${item.product.image}`} alt={item.product.name} />
                    ) : (
                      <div className="cart-no-image">No Image</div>
                    )}
                    <div className="cart-item-details">
                      <h3>{item.product.name}</h3>
                      <p className="cart-item-price">₹{item.product.selling_price}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button onClick={() => updateCartQuantity(item.product.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, 1)}>+</button>
                      </div>
                      <p className="cart-item-total">₹{(Number(item.product.selling_price) * item.quantity).toFixed(2)}</p>
                      <button className="remove-btn" onClick={() => removeFromCart(item.product.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Bill:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <button className="continue-btn" onClick={() => navigateTo('checkout')}>Continue</button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentPage === 'checkout' && (
        <div className="checkout-page">
          <h2>Checkout Details</h2>
          <form className="checkout-form" onSubmit={async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const orderData = {
              customer_name: formData.get('customer_name'),
              phone: formData.get('phone'),
              email: formData.get('email'),
              address: formData.get('address'),
              cart: cart,
              total_amount: cartTotal
            };

            try {
              const response = await fetch('http://127.0.0.1:8000/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(orderData)
              });

              if (response.ok) {
                showToast("Order Submitted Successfully! ✅");
                setCart([]);
                navigateTo('home');
              } else {
                showToast("Failed to submit order. Please try again. ❌");
              }
            } catch (error) {
              console.error(error);
              showToast("An error occurred while submitting the order. ❌");
            }
          }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="customer_name" required placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" required placeholder="Enter your phone number" />
            </div>
            <div className="form-group">
              <label>Email (Optional)</label>
              <input type="email" name="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea name="address" required rows="4" placeholder="Enter your full delivery address"></textarea>
            </div>
            
            <div className="checkout-summary">
              <h3>Order Total: ₹{cartTotal.toFixed(2)}</h3>
              <p>{cart.reduce((sum, item) => sum + item.quantity, 0)} Items</p>
            </div>
            
            <button type="submit" className="submit-order-btn">Submit Order</button>
          </form>
        </div>
      )}

      {currentPage === 'safety' && (
        <div className="safety-page">
          <h2>Safety Tips</h2>
          <p className="safety-intro">There are certain Do's & Don’ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers. A little negligence, ignorance and carelessness can cause a fatal injury.</p>
          
          <div className="safety-grid">
            <div className="safety-dos">
              <h3>✅ Do's</h3>
              <ul>
                <li><strong>Instructions</strong> Display fireworks as per the instructions mentioned on the pack.</li>
                <li><strong>Outdoor</strong> Use fireworks only outdoor.</li>
                <li><strong>Branded Fireworks</strong> Buy fireworks from authorized / reputed manufacturers only.</li>
                <li><strong>Distance</strong> Light only one firework at a time, by one person. Others should watch from a safe distance.</li>
                <li><strong>Water</strong> Keep two buckets of water handy. In the event of fire or any mishap.</li>
                <li><strong>Footwear</strong> Always wear closed footwear while bursting crackers.</li>
                <li><strong>Supervision</strong> Children should always be supervised by adults when playing with fireworks.</li>
              </ul>
            </div>
            <div className="safety-donts">
              <h3>❌ Don'ts</h3>
              <ul>
                <li><strong>Don't make tricks</strong> Never make your own fireworks.</li>
                <li><strong>Don't relight</strong> Never try to re-light or pick up fireworks that have not ignited fully.</li>
                <li><strong>Don't carry it</strong> Never carry fireworks in your pockets.</li>
                <li><strong>Don't Touch it</strong> After fireworks display never pick up fireworks that may be left over, they still may be active.</li>
                <li><strong>Don't wear loose clothes</strong> Do not wear loose clothing while using fireworks.</li>
                <li><strong>Don't use glass/metal</strong> Never ignite fireworks in metal or glass containers.</li>
                <li><strong>Don't aim at others</strong> Never point or throw fireworks at another person.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <a
        href="https://wa.me/919677676898"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
        />
      </a>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="logo-placeholder">
              <span className="logo-s">M</span>
              <div className="logo-text">
                <span className="logo-brand">Madhan</span>
                <span className="logo-crackers">CRACKERS</span>
              </div>
            </div>
            <div className="showroom-info">
              <h4 className="footer-subtitle">Our Showroom</h4>
              <p>123, Main Road, Sivakasi - 626 123.</p>
            </div>
          </div>

          <div className="footer-col">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <span className="contact-label">Whats App</span>
              <a href="https://wa.me/919677676898">💬 +91 96776 76898</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Mobile</span>
              <a href="tel:+919677676898">📞 +91 96776 76898</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:2001madhanraj@gmail.com">✉ 2001madhanraj@gmail.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <div className="quick-links-grid">
              <a href="#" className="link-btn" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
              <a href="#" className="link-btn" onClick={(e) => { e.preventDefault(); navigateToCollections(); }}>Collections</a>
              <a href="#" className="link-btn" onClick={(e) => { e.preventDefault(); navigateTo('safety'); }}>Safety Tips</a>
              <a href="#" className="link-btn" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Price List</a>
              <a href="#" className="link-btn" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>About Us</a>
              <a href="#" className="link-btn" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Contact us</a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Reach Us</h3>
            <div className="map-container">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d245.98607378985142!2d77.79851768296618!3d9.440929249629162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1791292434246!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2026, Madhan Crackers. All rights reserved</p>
        </div>
      </footer>
      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;