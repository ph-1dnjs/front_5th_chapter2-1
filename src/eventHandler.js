import { PRODUCTS, CART_ITEM_QUANTITY_TEXT, CART_ITEM_ADD_ALERT } from './constant';
import { CartItem } from './component';
import { updateCartSummary, handleCartItemUpdate, removeCartItem } from './util';

export function setCartEventHandlers() {
  document.getElementById('add-to-cart').addEventListener('click', handleAddToCart);
  document.getElementById('cart-items').addEventListener('click', handleCartItemsClick);
}

function handleAddToCart() {
  const $ProductSelect = document.getElementById('product-select');
  const selItem = $ProductSelect.value;
  const itemToAdd = PRODUCTS.find(function (p) {
    return p.id === selItem;
  });

  if (itemToAdd && itemToAdd.stock > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[1]) + 1;
      if (newQty <= itemToAdd.stock) {
        item.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.price}원 ${CART_ITEM_QUANTITY_TEXT}${newQty}`;
        itemToAdd.stock--;
      } else {
        alert(CART_ITEM_ADD_ALERT);
      }
    } else {
      const $cartItem = CartItem(itemToAdd);
      document.getElementById('cart-items').appendChild($cartItem);
      itemToAdd.stock--;
    }

    updateCartSummary();
  }
}

function handleCartItemsClick(event) {
  const tgt = event.target;

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = PRODUCTS.find(function (p) {
    return p.id === prodId;
  });

  if (tgt.classList.contains('quantity-change')) {
    handleCartItemUpdate(itemElem, tgt, prod);
  } else if (tgt.classList.contains('remove-item')) {
    removeCartItem(itemElem, prod);
  }

  updateCartSummary();
}
