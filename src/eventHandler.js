import { PRODUCTS, CART_ITEM_QUANTITY_TEXT, CART_ITEM_ADD_ALERT } from './constant';
import { CartItem } from './component';
import { updateCartSummary, handleCartItemUpdate, removeCartItem } from './util/cart';

export function setCartEventHandlers() {
  document.getElementById('add-to-cart').addEventListener('click', handleAddToCart);
  document.getElementById('cart-items').addEventListener('click', handleCartItemsClick);
}

function handleAddToCart() {
  const $productSelect = document.getElementById('product-select');
  const selectedProductId = $productSelect.value;
  const product = findProductById(selectedProductId);
  if (!product || product.stock <= 0) return;

  const $existingCartItem = document.getElementById(product.id);
  if ($existingCartItem) {
    updateExistingCartItem($existingCartItem, product);
  } else {
    addNewCartItem(product);
  }

  updateCartSummary();
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

// 상품 찾기
function findProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

// 기존 장바구니 항목 업데이트
function updateExistingCartItem(cartItemElement, product) {
  const quantitySpan = cartItemElement.querySelector('span');
  const currentQuantity = getItemQuantity(quantitySpan.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity > product.stock) {
    alert(CART_ITEM_ADD_ALERT);
    return;
  }

  quantitySpan.textContent = `${product.name} - ${product.price}원 ${CART_ITEM_QUANTITY_TEXT}${newQuantity}`;
  product.stock--;
}

// 새 장바구니 항목 추가
function addNewCartItem(product) {
  const $cartItemElement = CartItem(product);
  document.getElementById('cart-items').appendChild($cartItemElement);
  product.stock--;
}

// 수량 파싱 유틸
function getItemQuantity(text) {
  return parseInt(text.split(CART_ITEM_QUANTITY_TEXT)[1]);
}
