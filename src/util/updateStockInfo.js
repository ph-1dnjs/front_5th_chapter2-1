import { PRODUCTS, LOW_STOCK_THRESHOLD } from '../constant';

/**
 * 재고 정보를 업데이트하여 화면에 표시합니다.
 * 제품 목록을 순회하여 재고가 적은 제품에 대해 경고 메시지를 생성합니다.
 * 재고가 5개 미만인 제품은 '재고 부족'으로 표시하고, 재고가 0인 제품은 '품절'로 표시합니다.
 * 생성된 메시지는 화면에 표시됩니다.
 */

export function updateStockInfo() {
  let infoMsg = '';
  const $cartStrockInfo = document.getElementById('stock-status');

  PRODUCTS.forEach(function (item) {
    if (item.stock < LOW_STOCK_THRESHOLD) {
      infoMsg += `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}\n`;
    }
  });

  $cartStrockInfo.textContent = infoMsg;
}
