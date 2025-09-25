class HomePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('category-filter');
    this.minPriceFilter = page.getByTestId('min-price-filter');
    this.maxPriceFilter = page.getByTestId('max-price-filter');
    this.cartButton = page.getByTestId('cart-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchProducts(searchTerm) {
    await this.searchInput.fill(searchTerm);
  }

  async filterByCategory(category) {
    await this.categoryFilter.selectOption(category);
  }

  async filterByPriceRange(minPrice, maxPrice) {
    if (minPrice) await this.minPriceFilter.fill(minPrice.toString());
    if (maxPrice) await this.maxPriceFilter.fill(maxPrice.toString());
  }

  async addProductToCart(productId) {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async getProductCount() {
    return await this.page.locator('[data-testid^="product-"]').count();
  }
}

module.exports = { HomePage };