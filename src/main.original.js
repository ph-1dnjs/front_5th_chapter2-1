import {
  PRODUCTS,
  DISCOUNT_LUCKY_ITEM,
  DISCOUNT_SUGGEST_ITEM,
  BULK_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_RATE,
  EXTRA_DISCOUNT_DAY,
  EXTRA_DISCOUNT_RATE,
  LUCKY_ITEM_INTERVAL,
  SUGGEST_ITEM_INTERVAL,
  LOW_STOCK_THRESHOLD,
  CART_ITEM_QUANTITY_TEXT,
  CART_ITEM_ADD_ALERT,
} from './constant';
import { CartContainer, CartWrapper, CartItem } from './component';
import { getDiscountRate } from './util';

// TODO: item, product 의미는 다르지만 사용되는 목적은 동일하기에 관리 차원에서 통일.
// id 값이 테스트에 영향을 미치기 때문에 한번에 테스트 코드와 같이 수정할 예정

let lastSelectProduct,
  rewardPoints = 0,
  totalAmount = 0,
  productCount = 0;

function main() {
  const root = document.getElementById('app');
  const container = CartContainer();
  const wrapper = CartWrapper();

  container.appendChild(wrapper);
  root.appendChild(container);

  updateSelectOption();
  updateCartSummary();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * DISCOUNT_LUCKY_ITEM);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOption();
      }
    }, LUCKY_ITEM_INTERVAL);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectProduct) {
        const suggest = PRODUCTS.find(function (item) {
          return item.id !== lastSelectProduct && item.stock > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * DISCOUNT_SUGGEST_ITEM);
          updateSelectOption();
        }
      }
    }, SUGGEST_ITEM_INTERVAL);
  }, Math.random() * 20000);
}

function updateSelectOption() {
  document.getElementById('product-select').innerHTML = '';

  PRODUCTS.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.stock === 0) option.disabled = true;
    document.getElementById('product-select').appendChild(option);
  });
}

function updateCartSummary() {
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
  $cartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild(span);
  }

  updateStockInfo();
  renderRewardPoints($cartTotal);
}

const renderRewardPoints = ($cartTotal) => {
  rewardPoints = Math.floor(totalAmount / 1000);
  let ptsTag = document.getElementById('loyalty-points');

  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + rewardPoints + ')';
};

function updateStockInfo() {
  let infoMsg = '';
  const $cartStrockInfo = document.getElementById('stock-status');

  PRODUCTS.forEach(function (item) {
    if (item.stock < LOW_STOCK_THRESHOLD) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });

  $cartStrockInfo.textContent = infoMsg;
}

main();

document.getElementById('add-to-cart').addEventListener('click', function () {
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
          itemToAdd.name + ' - ' + itemToAdd.price + '원 ' + CART_ITEM_QUANTITY_TEXT + newQty;
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
    lastSelectProduct = selItem;
  }
});

document.getElementById('cart-items').addEventListener('click', function (event) {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = PRODUCTS.find(function (p) {
      return p.id === prodId;
    });

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.stock +
            parseInt(itemElem.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[0] +
          CART_ITEM_QUANTITY_TEXT +
          newQty;
        prod.stock -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.stock -= qtyChange;
      } else {
        alert(CART_ITEM_ADD_ALERT);
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(
        itemElem.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[1],
      );
      prod.stock += remQty;
      itemElem.remove();
    }

    updateCartSummary();
  }
});
