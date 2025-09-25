class CartPage {
  constructor(page) {
    this.page = page;
    this.cart = page.getByTestId('cart');
    this.closeCartButton = page.getByTestId('close-cart');
    this.checkoutButton = page.getByTestId('checkout-button');
  }

  async isOpen() {
    return await this.cart.evaluate(el => el.classList.contains('open'));
  }

  async closeCart() {
    await this.closeCartButton.click();
  }

  async updateQuantity(productId, action) {
    if (action === 'increase') {
      await this.page.getByTestId(`increase-${productId}`).click();
    } else if (action === 'decrease') {
      await this.page.getByTestId(`decrease-${productId}`).click();
    }
  }

  async removeItem(productId) {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async getItemQuantity(productId) {
    return await this.page.getByTestId(`quantity-${productId}`).textContent();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };