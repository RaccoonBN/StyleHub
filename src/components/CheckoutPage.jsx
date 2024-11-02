import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import OrderForm from '../components/OrderForm';

function CheckoutPage() {
    const { cart } = useContext(CartContext);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.product_id} className="cart-item">
                        <h2>{item.product_name}</h2>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price} VND</p>
                    </div>
                ))}
                <h3>Total: {cart.reduce((total, item) => total + item.price * item.quantity, 0)} VND</h3>
            </div>
            <OrderForm />
        </div>
    );
}

export default CheckoutPage;
