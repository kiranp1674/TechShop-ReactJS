import { useState } from 'react'
import { FiCheck, FiStar } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import reviewsData from '../api/reviewsData'
import productsData from '../api/productsData'
import { getProductImage } from '../utils/productImages'
import formatPrice from '../utils/formatPrice'
import ProductCard from '../components/ProductCard'

function ProductDetails({ addedProductIds, onAddToCart }) {
    const { id } = useParams()
    const product = productsData.find((item) => item.id === Number(id))
    const [activeImage, setActiveImage] = useState(0)
    const [activeTab, setActiveTab] = useState('Specifications')

    if (!product) {
        return <section className='empty-state'><h1>Product not found</h1></section>
    }

    const discount = Math.round((1 - product.finalPrice / product.originalPrice) * 100)
    const isAdded = addedProductIds.includes(product.id)
    const relatedProducts = productsData
        .filter((item) => item.category === product.category)
        .sort((left, right) => left.id - right.id)
        .slice(0, 4)

    return (
        <section className='product-detail-page'>
            <div className='product-gallery'>
                <div className='product-thumbnails'>
                    {product.images.map((image, index) => (
                        <button
                            aria-label={`Show product image ${index + 1}`}
                            aria-pressed={activeImage === index}
                            className={activeImage === index ? 'selected' : ''}
                            key={image}
                            onClick={() => setActiveImage(index)}
                            type='button'
                        >
                            <img alt='' src={getProductImage(image)} />
                        </button>
                    ))}
                </div>
                <div className='product-detail-image'>
                    <img alt={product.title} src={getProductImage(product.images[activeImage])} />
                </div>
            </div>
            <div className='product-detail-copy'>
                <p className='eyebrow'>{product.brand}</p>
                <h1>{product.title}</h1>
                <p className='product-detail-info'>{product.info}</p>
                <div className='detail-rating'>
                    <span>{Array.from({ length: 5 }, (_, index) => <FiStar className={index < product.rateCount ? 'star-filled' : ''} key={index} />)}</span>
                    <span>{product.ratings} Ratings</span>
                </div>
                <div className='detail-price'>
                    <strong>{formatPrice(product.finalPrice)}</strong>
                    <del>{formatPrice(product.originalPrice)}</del>
                    <span>{discount}% off</span>
                </div>
                <p className='savings-note'>You save: {formatPrice(product.originalPrice - product.finalPrice)} ({discount}%)</p>
                <p className='tax-note'>(Inclusive of all taxes)</p>
                <p className='stock-status'><FiCheck /> In Stock</p>
                <div className='offers'>
                    <h2>Offers and Discounts</h2>
                    <div className='offer-options'>
                        <span>No Cost EMI on Credit Card</span>
                        <span>Pay Later &amp; Avail Cashback</span>
                    </div>
                </div>
                <button
                    className={`button ${isAdded ? 'button-added' : 'button-primary'} detail-add-button`}
                    disabled={isAdded}
                    onClick={() => onAddToCart(product)}
                    type='button'
                >
                    {isAdded ? 'Added' : 'Add to cart'}
                </button>
            </div>

            <section aria-label='Product information' className='product-information'>
                <div className='detail-tabs' role='tablist'>
                    {['Specifications', 'Overview', 'Reviews'].map((tab) => (
                        <button
                            aria-selected={activeTab === tab}
                            className={activeTab === tab ? 'active' : ''}
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            role='tab'
                            type='button'
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {activeTab === 'Overview' && (
                    <div className='detail-tab-content'>
                        <h2>{product.title}</h2>
                        <p>The {product.title} {product.info.toLowerCase()} combines great sound, comfortable fit, and everyday convenience.</p>
                        <ul>
                            <li>Designed for clear, immersive sound.</li>
                            <li>Comfortable for everyday listening.</li>
                            <li>Includes a manufacturer warranty.</li>
                        </ul>
                        <p>Buy the <span className='text-danger text-bold'>{product.title}</span> which offers you with fabulous music experience by providing you with awesome sound quality that you can never move on from. Enjoy perfect flexibility and mobility with amazing musical quality with these Earbuds gicing you a truely awesome audio experience. It blends with exceptioonl sound quality and a range features for an unrivalled listening experience.</p>
                    </div>
                )}
                {activeTab === 'Specifications' && (
                    <dl className='specification-list'>
                        <div><dt>Brand</dt><dd>{product.brand}</dd></div>
                        <div><dt>Model</dt><dd>{product.title}</dd></div>
                        <div><dt>Generic Name</dt><dd>{product.category}</dd></div>
                        <div><dt>Headphone Type</dt><dd>{product.type}</dd></div>
                        <div><dt>Connectivity</dt><dd>{product.connectivity}</dd></div>
                        <div><dt>Microphone</dt><dd>Yes</dd></div>
                    </dl>
                )}
                {activeTab === 'Reviews' && (
                    <div className='reviews-list'>
                        {reviewsData.map((review) => (
                            <article className='review-card' key={review.id}>
                                <div><strong>{review.name}</strong><time>{review.date}</time></div>
                                <span className='review-stars'>{'★'.repeat(review.rateCount)}{'☆'.repeat(5 - review.rateCount)}</span>
                                <p>{review.review}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            <section aria-label='Related products' className='related-products'>
                <h2>Related Products</h2>
                <div className='product-grid related-grid'>
                    {relatedProducts.map((item) => (
                        <ProductCard addedProductIds={addedProductIds} key={item.id} onAddToCart={onAddToCart} product={item} />
                    ))}
                </div>
                <div aria-label='Related product pages' className='featured-dots'>
                    {[0, 1, 2, 3].map((index) => (
                        <span aria-current={index === 0 ? 'true' : undefined} key={index} />
                    ))}
                </div>
            </section>
        </section>
    )
}

export default ProductDetails
