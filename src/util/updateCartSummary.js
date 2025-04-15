import {
  PRODUCTS,
  BULK_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_RATE,
  EXTRA_DISCOUNT_DAY,
  EXTRA_DISCOUNT_RATE,
  CART_ITEM_QUANTITY_TEXT,
} from '../constant';
import { getDiscountRate, updateStockInfo, renderRewardPoints } from '../util';
import { DiscountRate } from '../component';

let totalAmount = 0;
let productCount = 0;

export function updateCartSummary() {
  totalAmount = 0;
  productCount = 0;

  const $cartItems = document.getElementById('cart-items');
  const cartItems = $cartItems.children;
  let totalBeforeDiscount = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentCartItem;

      for (let j = 0; j < PRODUCTS.length; j++) {
        if (PRODUCTS[j].id === cartItems[i].id) {
          currentCartItem = PRODUCTS[j];
          break;
        }
      }

      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[1],
      );
      const itemTotal = currentCartItem.price * quantity;
      const discount = getDiscountRate(currentCartItem.id, quantity);

      productCount += quantity;
      totalBeforeDiscount += itemTotal;
      totalAmount += itemTotal * (1 - discount);
    })();
  }

  let discRate = 0;

  if (productCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDisc = totalAmount * BULK_DISCOUNT_RATE;
    const itemDisc = totalBeforeDiscount - totalAmount;

    if (bulkDisc > itemDisc) {
      totalAmount = totalBeforeDiscount * (1 - BULK_DISCOUNT_RATE);
      discRate = BULK_DISCOUNT_RATE;
    } else {
      discRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
    }
  } else {
    discRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
  }

  if (new Date().getDay() === EXTRA_DISCOUNT_DAY) {
    totalAmount *= 1 - EXTRA_DISCOUNT_RATE;
    discRate = Math.max(discRate, EXTRA_DISCOUNT_RATE);
  }

  const $cartTotal = document.getElementById('cart-total');
  $cartTotal.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discRate > 0) {
    $cartTotal.appendChild(DiscountRate(discRate));
  }

  updateStockInfo();
  renderRewardPoints($cartTotal, totalAmount);
}
