import { FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getProductImage } from '../utils/productImages'
import formatPrice from '../utils/formatPrice'

function ProductCard({ addedProductIds, product, onAddToCart }) {
    const isAdded = addedProductIds.includes(product.id)

    return (
        <article className='product-card'>
            <Link className='product-image-link' to={`/product-details/${product.id}`}>
                <img alt={product.title} loading='lazy' src={getProductImage(product.images[0])} />
            </Link>
            <div className='product-rating' aria-label={`${product.rateCount} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                    <FiStar className={index < product.rateCount ? 'star-filled' : ''} key={index} />
                ))}
                <span>({product.ratings})</span>
            </div>
            <Link className='product-title' to={`/product-details/${product.id}`}>
                {product.title}
            </Link>
            <p className='product-info'>{product.info}</p>
            <div className='product-prices'>
                <strong>{formatPrice(product.finalPrice)}</strong>
                <del>{formatPrice(product.originalPrice)}</del>
            </div>
            <button
                className={`button ${isAdded ? 'button-added' : 'button-primary'} add-to-cart`}
                disabled={isAdded}
                onClick={() => onAddToCart(product)}
                type='button'
            >
                {isAdded ? 'Added' : 'Add to cart'}
            </button>
        </article>
    )
}

export default ProductCard
