import {
  calculateCartTotals,
  applyBulkAndExtraDiscount,
  updateStockInfo,
  updateCartTotalUI,
  renderRewardPoints,
} from '../util';

/**
 * 장바구니 요약을 업데이트하는 함수.
 *
 * 장바구니에 담긴 아이템들의 총합을 계산하고, 할인율을 적용한 후
 * UI를 갱신합니다. 또한, 재고 정보를 업데이트하고 포인트를 렌더링합니다.
 */

export function updateCartSummary() {
  const cartItems = [...document.getElementById('cart-items').children];

  const { totalBeforeDiscount, totalAfterItemDiscount, productCount } =
    calculateCartTotals(cartItems);

  const { finalTotal, appliedDiscountRate } = applyBulkAndExtraDiscount(
    totalBeforeDiscount,
    totalAfterItemDiscount,
    productCount,
  );

  updateCartTotalUI(finalTotal, appliedDiscountRate);
  updateStockInfo();
  renderRewardPoints(document.getElementById('cart-total'), finalTotal);
}
