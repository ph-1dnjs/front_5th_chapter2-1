import React, { useState } from 'react';
import { ProductSelectOption } from './component/ProductSelectOption';
import { ProductAddButton } from './component/ProductAddButton';
import { ProductStockInfo } from './component/ProductStockInfo';
import { PRODUCTS } from './constant/product';
import { CartTotal } from './component/CartTotal';
import { IProduct, ICartProduct } from './type/product';
import { CartProducts } from './component/CartProducts';

const App = () => {
  const [products, setProducts] = useState(PRODUCTS);
  const [cartProducts, setCartProducts] = useState<Record<string, ICartProduct>>({});
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);

  const handleAddToCart = () => {
    const productId = selectedProduct.id;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return;
    }
    if (product.stock <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    setCartProducts((prevCart) => {
      const existingProduct = prevCart[productId];

      // 이미 카트에 존재한다면 수량 증가
      if (existingProduct) {
        return {
          ...prevCart,
          [productId]: {
            ...existingProduct,
            quantity: (existingProduct.quantity ?? 1) + 1,
          },
        };
      }

      // 새로 추가하는 경우
      const productToAdd = products.find((p) => p.id === productId);
      if (!productToAdd) {
        return prevCart;
      }

      updateProducts(productId, -1);

      return {
        ...prevCart,
        [productId]: {
          ...productToAdd,
          quantity: 1,
        },
      };
    });
  };

  const handleSelectOption = (productId: string) => {
    const product = products.find((p) => p.id === productId) as IProduct;
    setSelectedProduct(product);
  };

  const handleDecreaseQuantity = (productId: string) => {
    setCartProducts((prevCart) => {
      const currentProduct = prevCart[productId];
      if (!currentProduct) {
        return prevCart;
      }

      const productInStock = products.find((p) => p.id === productId);
      if (!productInStock) {
        return prevCart;
      }

      if (currentProduct.quantity > 1) {
        updateProducts(productId, 1);
        return {
          ...prevCart,
          [productId]: {
            ...currentProduct,
            quantity: currentProduct.quantity - 1,
          },
        };
      } else {
        const newCart = { ...prevCart };

        delete newCart[productId];

        updateProducts(productId, currentProduct.quantity);

        return newCart;
      }
    });
  };

  const handleIncreaseQuantity = (productId: string) => {
    setCartProducts((prevCart) => {
      const currentProduct = prevCart[productId];
      const productInStock = products.find((p) => p.id === productId);

      if (productInStock && productInStock.stock <= 0) {
        alert('재고가 부족합니다.');
        return prevCart;
      }

      updateProducts(productId, -1);
      return {
        ...prevCart,
        [productId]: {
          ...currentProduct,
          quantity: currentProduct.quantity + 1,
        },
      };
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartProducts((prevCart) => {
      const currentProduct = prevCart[productId];
      const newCart = { ...prevCart };

      delete newCart[productId];

      updateProducts(productId, currentProduct.quantity);

      return newCart;
    });
  };

  const updateProducts = (productId, value) => {
    const updateProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, stock: product.stock + value };
      }
      return product;
    });
    setProducts(updateProducts);
  };

  return (
    <div className='bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        <CartProducts
          products={cartProducts}
          onDecreaseQuantity={handleDecreaseQuantity}
          onIncreaseQuantity={handleIncreaseQuantity}
          onRemoveProduct={handleRemoveFromCart}
        />
        <CartTotal finalTotal={0} discountRate={0} />
        <ProductSelectOption products={products} onClick={handleSelectOption} />
        <ProductAddButton onClick={handleAddToCart} />
        <ProductStockInfo products={products} />
      </div>
    </div>
  );
};

export default App;
