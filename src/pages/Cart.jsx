import { FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getProductImage } from '../utils/productImages'
import formatPrice from '../utils/formatPrice'

function Cart({ cartItems, onChangeQuantity, onRemove }) {
    const originalTotal = cartItems.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0)
    const total = cartItems.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0)
    const discount = originalTotal - total

    if (!cartItems.length) {
        return (
            <section className='empty-state'>
                <FiShoppingCart aria-hidden='true' className='empty-cart-icon' />
                <h1>Your Cart is Empty</h1>
                <Link className='button button-primary' to='/products'>Start Shopping</Link>
            </section>
        )
    }

    return (
        <section className='cart-page'>
            <h1>Shopping Cart</h1>
            <div className='cart-layout'>
                <div className='cart-items'>
                    {cartItems.map(({ product, quantity }) => (
                        <article className='cart-item' key={product.id}>
                            <Link className='cart-item-image' to={`/product-details/${product.id}`}>
                                <img alt={product.title} src={getProductImage(product.images[0])} />
                            </Link>
                            <div className='cart-item-info'>
                                <Link className='product-title' to={`/product-details/${product.id}`}>
                                    {product.title} {product.info}
                                </Link>
                                <div className='cart-item-prices'>
                                    <strong>{formatPrice(product.finalPrice)}</strong>
                                    <del>{formatPrice(product.originalPrice)}</del>
                                </div>
                                <div className='quantity-control'>
                                    <button aria-label={`Decrease ${product.title} quantity`} disabled={quantity <= 1} onClick={() => onChangeQuantity(product.id, quantity - 1)} type='button'>−</button>
                                    <span>{quantity}</span>
                                    <button aria-label={`Increase ${product.title} quantity`} onClick={() => onChangeQuantity(product.id, quantity + 1)} type='button'>+</button>
                                </div>
                            </div>
                            <button aria-label={`Remove ${product.title}`} className='remove-item' onClick={() => onRemove(product.id)} type='button'>
                                <FiTrash2 />
                            </button>
                        </article>
                    ))}
                </div>
                <aside className='cart-summary'>
                    <h2>Order Summary <span>({cartItems.reduce((count, item) => count + item.quantity, 0)} items)</span></h2>
                    <p><span>Original Price</span><strong>{formatPrice(originalTotal)}</strong></p>
                    <p><span>Discount</span><strong className='cart-discount'>−{formatPrice(discount)}</strong></p>
                    <p><span>Delivery</span><strong>Free</strong></p>
                    <hr />
                    <p className='cart-total'><span>Total Price</span><strong>{formatPrice(total)}</strong></p>
                    <button className='button button-primary checkout-button' onClick={() => window.alert('Checkout is not connected in this demo.')} type='button'>
                        Checkout
                    </button>
                </aside>
            </div>
        </section>
    )
}

export default Cart
