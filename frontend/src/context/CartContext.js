import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, { ...product, quantity: 1 }]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};
