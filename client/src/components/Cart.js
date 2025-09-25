import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, isOpen, onClose, updateQuantity, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`cart ${isOpen ? 'open' : ''}`} data-testid="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button onClick={onClose} data-testid="close-cart">×</button>
      </div>
      
      <div style={{ padding: '1rem' }}>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    data-testid={`decrease-${item.id}`}
                  >
                    -
                  </button>
                  <span data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    data-testid={`increase-${item.id}`}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    data-testid={`remove-${item.id}`}
                    style={{ marginLeft: '1rem', color: 'red' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Total: ${total.toFixed(2)}
            </div>
            
            <Link 
              to="/checkout" 
              className="btn btn-primary" 
              style={{ 
                display: 'block', 
                textAlign: 'center', 
                marginTop: '1rem',
                width: '100%'
              }}
              onClick={onClose}
              data-testid="checkout-button"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;