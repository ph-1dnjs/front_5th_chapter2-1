import React from 'react';

interface IProps {
  finalTotal: number;
  discountRate: number;
}

function CartTotal({ finalTotal, discountRate }: IProps) {
  const point = Math.floor(finalTotal / 1000);

  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      총액: {Math.round(finalTotal)}원<span className='text-blue-500 ml-2'>(포인트: {point})</span>
    </div>
  );
}

export { CartTotal };
