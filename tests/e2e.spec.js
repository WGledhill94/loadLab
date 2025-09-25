const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');
const { CartPage } = require('./pages/CartPage');
const { CheckoutPage } = require('./pages/CheckoutPage');

test.describe('LoadLab E-commerce Tests', () => {
  test('should search and filter products', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    await homePage.searchProducts('headphones');
    
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    await homePage.filterByCategory('Electronics');
    await homePage.filterByPriceRange(100, 300);
  });

  test('should add products to cart and manage quantities', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    
    await homePage.goto();
    await homePage.addProductToCart(1);
    await homePage.openCart();
    
    expect(await cartPage.isOpen()).toBe(true);
    
    await cartPage.updateQuantity(1, 'increase');
    const quantity = await cartPage.getItemQuantity(1);
    expect(quantity).toBe('2');
    
    await cartPage.closeCart();
  });

  test('should complete guest checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await homePage.goto();
    await homePage.addProductToCart(1);
    await homePage.openCart();
    await cartPage.proceedToCheckout();
    
    const customerData = {
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test St',
      city: 'Test City',
      zipCode: '12345'
    };
    
    const paymentData = {
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123'
    };
    
    await checkoutPage.completeCheckout(customerData, paymentData);
    
    // Wait for order confirmation
    await page.waitForFunction(() => 
      window.location.pathname === '/' || 
      document.body.textContent.includes('Order confirmed')
    );
  });

  test('should handle user registration and login', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill(`test${Date.now()}@example.com`);
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('register-button').click();
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Hello, Test User')).toBeVisible();
  });
});