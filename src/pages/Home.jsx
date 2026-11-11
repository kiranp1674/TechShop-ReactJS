import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import servicesData from '../api/servicesData'
import productsData from '../api/productsData'
import { getProductImage } from '../utils/productImages'
import formatPrice from '../utils/formatPrice'
import ProductCard from '../components/ProductCard'

const categories = ['All', 'Headphones', 'Earbuds', 'Earphones', 'Neckbands']

function Home({ addedProductIds, onAddToCart }) {
    const heroProducts = useMemo(() => productsData.filter((product) => product.tag === 'hero-product'), [])
    const featuredProducts = useMemo(() => productsData.filter((product) => product.tag === 'featured-product'), [])
    const [activeHero, setActiveHero] = useState(0)
    const [activeFeatured, setActiveFeatured] = useState(0)
    const [featuredDirection, setFeaturedDirection] = useState(null)
    const [isFeaturedAnimating, setIsFeaturedAnimating] = useState(false)
    const featuredMoveInProgress = useRef(false)
    const [activeCategory, setActiveCategory] = useState('All')
    const product = heroProducts[activeHero]

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveHero((index) => (index + 1) % heroProducts.length)
        }, 7000)
        return () => window.clearInterval(timer)
    }, [heroProducts.length])

    const moveFeatured = useCallback((direction) => {
        if (featuredMoveInProgress.current) return

        featuredMoveInProgress.current = true
        setFeaturedDirection(direction)
        setIsFeaturedAnimating(false)
        window.requestAnimationFrame(() => setIsFeaturedAnimating(true))
    }, [])

    useEffect(() => {
        const timer = window.setInterval(() => moveFeatured('next'), 3000)
        return () => window.clearInterval(timer)
    }, [moveFeatured])

    const featuredOffsets = featuredDirection === 'previous'
        ? [-3, -2, -1, 0, 1, 2]
        : [-2, -1, 0, 1, 2, 3]
    const activeFeaturedIndex = (
        (activeFeatured % featuredProducts.length) + featuredProducts.length
    ) % featuredProducts.length
    const emphasizedOffset = isFeaturedAnimating
        ? featuredDirection === 'next' ? 1 : -1
        : 0
    const visibleFeatured = featuredOffsets.map((offset) => {
        const index = (
            (activeFeatured + offset) % featuredProducts.length + featuredProducts.length
        ) % featuredProducts.length
        return {
            product: featuredProducts[index],
            isActive: offset === emphasizedOffset,
            isCurrent: offset === 0,
            key: activeFeatured + offset,
            offset,
        }
    })

    function finishFeaturedTransition(event) {
        if (event.target !== event.currentTarget || event.propertyName !== 'transform') return

        setActiveFeatured((index) => (
            featuredDirection === 'next'
                ? index + 1
                : index - 1
        ))
        setIsFeaturedAnimating(false)
        setFeaturedDirection(null)
        featuredMoveInProgress.current = false
    }

    function selectFeatured(index) {
        featuredMoveInProgress.current = false
        setIsFeaturedAnimating(false)
        setFeaturedDirection(null)
        setActiveFeatured(index)
    }

    const topProducts = productsData.slice(0, 11).filter((item) =>
        activeCategory === 'All' || item.category === activeCategory
    )

    return (
        <>
            <section aria-label='Featured offer' className='hero-section'>
                <div className='hero-copy' key={product.id}>
                    <p className='hero-product-name'>{product.title}</p>
                    <h1>{product.tagline}</h1>
                    <div className='hero-price'>
                        <strong>{formatPrice(product.finalPrice)}</strong>
                        <del>{formatPrice(product.originalPrice)}</del>
                    </div>
                    <Link className='button button-primary hero-button' to={`/product-details/${product.id}`}>
                        Shop Now
                    </Link>
                </div>
                <Link aria-label={`View ${product.title}`} className='hero-image' key={`image-${product.id}`} to={`/product-details/${product.id}`}>
                    <img alt={product.title} src={getProductImage(product.heroImage || product.images[0])} />
                </Link>
                <div aria-label='Choose featured offer' className='hero-dots'>
                    {heroProducts.map((item, index) => (
                        <button
                            aria-label={`Show offer ${index + 1}: ${item.title}`}
                            aria-pressed={index === activeHero}
                            className={index === activeHero ? 'active' : ''}
                            key={item.id}
                            onClick={() => setActiveHero(index)}
                            type='button'
                        />
                    ))}
                </div>
            </section>

            <section aria-label='Featured products' className='featured-strip'>
                <div className='section-heading'>
                    <h2 className='mb-3'>Featured Products</h2>
                    {/* <div className='carousel-controls'>
                        <button
                            aria-label='Previous featured products'
                            onClick={() => moveFeatured('previous')}
                            type='button'
                        >
                            <FiChevronLeft />
                        </button>
                        <button
                            aria-label='Next featured products'
                            onClick={() => moveFeatured('next')}
                            type='button'
                        >
                            <FiChevronRight />
                        </button>
                    </div> */}
                </div>
                <div
                    className={[
                        'featured-products',
                        featuredDirection ? `moving-${featuredDirection}` : '',
                        isFeaturedAnimating ? 'is-animating' : '',
                    ].filter(Boolean).join(' ')}
                    onTransitionEnd={finishFeaturedTransition}
                >
                    {visibleFeatured.map(({ product: item, isActive, isCurrent, key }) => (
                        <Link
                            aria-current={isCurrent ? 'true' : undefined}
                            className={isActive ? 'featured-product active' : 'featured-product'}
                            key={key}
                            to={`/product-details/${item.id}`}
                        >
                            <span>{item.title}</span>
                            <img alt='' src={getProductImage(item.images[0])} />
                            <strong>{formatPrice(item.finalPrice)}</strong>
                            <del>{formatPrice(item.originalPrice)}</del>
                        </Link>
                    ))}
                </div>
                <div aria-label='Featured product pages' className='featured-dots'>
                    {featuredProducts.map((item, index) => (
                        <button
                            aria-label={`Show featured products starting at ${item.title}`}
                            aria-pressed={index === activeFeaturedIndex}
                            className={index === activeFeaturedIndex ? 'active' : ''}
                            key={item.id}
                            onClick={() => selectFeatured(index)}
                            type='button'
                        />
                    ))}
                </div>
            </section>

            <section aria-label='Top products' className='home-products section-block'>
                <h2 className='top-products-title'>Top Products</h2>
                <div aria-label='Filter products by category' className='category-tabs'>
                    {categories.map((category) => (
                        <button
                            aria-pressed={activeCategory === category}
                            className={activeCategory === category ? 'active' : ''}
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            type='button'
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className='product-grid'>
                    {topProducts.map((item) => (
                        <ProductCard addedProductIds={addedProductIds} key={item.id} onAddToCart={onAddToCart} product={item} />
                    ))}
                    <Link className='browse-all-card' to='/products'>
                        Browse All<br />Products <span aria-hidden='true'>→</span>
                    </Link>
                </div>
            </section>

            <section aria-label='Our advantages' className='advantages'>
                <h2>Our Advantages</h2>
                <div className='advantage-list'>
                    {servicesData.map(({ id, icon: Icon, title, info }) => (
                        <div className='advantage-item' key={id}>
                            <Icon aria-hidden='true' />
                            <div><h3>{title}</h3><p>{info}</p></div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Home
