import { CART_ITEM_QUANTITY_TEXT, CART_ITEM_ADD_ALERT } from '../constant';

/**
 * 장바구니 아이템의 수량 변경 또는 삭제 처리를 담당하는 함수
 * @param {HTMLElement} itemElem - 처리할 아이템의 HTML 요소
 * @param {HTMLElement} tgt - 클릭된 타겟 요소 (수량 변경/삭제 버튼)
 * @param {object} prod - 해당 아이템의 제품 데이터
 */

export function handleCartItemUpdate(itemElem, tgt, prod) {
  const qtyChange = parseInt(tgt.dataset.change);
  const currentQty = parseInt(
    itemElem.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[1],
  );
  const newQty = currentQty + qtyChange;

  if (newQty > 0 && newQty <= prod.stock + currentQty) {
    itemElem.querySelector('span').textContent =
      `${itemElem.querySelector('span').textContent.split(CART_ITEM_QUANTITY_TEXT)[0]}${CART_ITEM_QUANTITY_TEXT}${newQty}`;
    prod.stock -= qtyChange;
  } else if (newQty <= 0) {
    itemElem.remove();
    prod.stock -= qtyChange;
  } else {
    alert(CART_ITEM_ADD_ALERT);
  }
}
