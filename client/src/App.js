import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link to="/" className="logo">LoadLab</Link>
              <div className="nav-links">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCartOpen(true)}
                  data-testid="cart-button"
                >
                  Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
                {user ? (
                  <>
                    <span>Hello, {user.name}</span>
                    <button className="btn btn-secondary" onClick={logout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                    <Link to="/register" className="btn btn-secondary">Register</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList addToCart={addToCart} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} setCart={setCart} />} />
          </Routes>
        </main>

        <Cart 
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>
    </Router>
  );
}

export default App;