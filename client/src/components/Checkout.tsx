import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartItem, User, CustomerInfo, PaymentInfo } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  user: User | null;
  setCart: (cart: CartItem[]) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, user, setCart }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        items: cart,
        customerInfo,
        paymentInfo: { ...paymentInfo, cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4) }
      };

      const response = await axios.post<{ orderId: string }>('/api/checkout', orderData);
      
      alert(`Order confirmed! Order ID: ${response.data.orderId}`);
      setCart([]);
      navigate('/');
    } catch (error) {
      alert('Checkout failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Checkout</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee'
            }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '2px solid #333'
          }}>
            Total: ${total.toFixed(2)}
          </div>
        </div>

        <form onSubmit={handleSubmit} data-testid="checkout-form">
          <h3>Customer Information</h3>
          
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              required
              data-testid="customer-name"
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              required
              data-testid="customer-email"
            />
          </div>
          
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              required
              data-testid="customer-address"
            />
          </div>
          
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
              required
              data-testid="customer-city"
            />
          </div>
          
          <div className="form-group">
            <label>Zip Code:</label>
            <input
              type="text"
              value={customerInfo.zipCode}
              onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
              required
              data-testid="customer-zip"
            />
          </div>

          <h3>Payment Information</h3>
          
          <div className="form-group">
            <label>Card Number:</label>
            <input
              type="text"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
              placeholder="1234 5678 9012 3456"
              required
              data-testid="card-number"
            />
          </div>
          
          <div className="form-group">
            <label>Expiry Date:</label>
            <input
              type="text"
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
              placeholder="MM/YY"
              required
              data-testid="expiry-date"
            />
          </div>
          
          <div className="form-group">
            <label>CVV:</label>
            <input
              type="text"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
              placeholder="123"
              required
              data-testid="cvv"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={processing}
            data-testid="place-order-button"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {processing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;