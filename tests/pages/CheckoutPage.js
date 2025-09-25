class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutForm = page.getByTestId('checkout-form');
    this.customerName = page.getByTestId('customer-name');
    this.customerEmail = page.getByTestId('customer-email');
    this.customerAddress = page.getByTestId('customer-address');
    this.customerCity = page.getByTestId('customer-city');
    this.customerZip = page.getByTestId('customer-zip');
    this.cardNumber = page.getByTestId('card-number');
    this.expiryDate = page.getByTestId('expiry-date');
    this.cvv = page.getByTestId('cvv');
    this.placeOrderButton = page.getByTestId('place-order-button');
  }

  async fillCustomerInfo(customerData) {
    await this.customerName.fill(customerData.name);
    await this.customerEmail.fill(customerData.email);
    await this.customerAddress.fill(customerData.address);
    await this.customerCity.fill(customerData.city);
    await this.customerZip.fill(customerData.zipCode);
  }

  async fillPaymentInfo(paymentData) {
    await this.cardNumber.fill(paymentData.cardNumber);
    await this.expiryDate.fill(paymentData.expiryDate);
    await this.cvv.fill(paymentData.cvv);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async completeCheckout(customerData, paymentData) {
    await this.fillCustomerInfo(customerData);
    await this.fillPaymentInfo(paymentData);
    await this.placeOrder();
  }
}

module.exports = { CheckoutPage };