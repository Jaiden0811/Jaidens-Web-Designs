// Pricing Calculator
document.addEventListener('DOMContentLoaded', () => {
  const priceCheckboxes = document.querySelectorAll('.feature-checkbox');
  
  priceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePrice);
  });
});

function updatePrice() {
  const checkboxes = document.querySelectorAll('.feature-checkbox:checked');
  let total = 0;
  const features = [];
  
  checkboxes.forEach(checkbox => {
    const price = parseInt(checkbox.getAttribute('data-price'));
    total += price;
    
    const label = checkbox.nextElementSibling;
    if (label) {
      const featureName = label.textContent.trim();
      features.push(`${featureName}: +$${price}`);
    }
  });
  
  // Update total price
  const totalPriceDiv = document.getElementById('totalPrice');
  if (totalPriceDiv) {
    totalPriceDiv.textContent = '$' + total;
  }
  
  // Update calculated features
  const calculatedDiv = document.getElementById('calculatedFeatures');
  if (calculatedDiv) {
    if (features.length === 0) {
      calculatedDiv.innerHTML = '';
    } else {
      calculatedDiv.innerHTML = features.map(f => `<div class="summary-item"><span>${f}</span></div>`).join('');
    }
  }
}

function placeOrderWithCalculator() {
  const checkboxes = document.querySelectorAll('.feature-checkbox:checked');
  if (checkboxes.length === 0) {
    alert('Please select at least one feature');
    return;
  }
  
  if (getCurrentUser()) {
    window.location.href = '/pages/order.html';
  } else {
    if (confirm('You need to sign in to place an order. Would you like to sign in now?')) {
      window.location.href = '/pages/signin.html?redirect=/pages/order.html';
    }
  }
}

console.log('Pricing calculator loaded');
