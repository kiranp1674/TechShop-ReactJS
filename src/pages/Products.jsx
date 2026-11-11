import { useMemo, useState } from 'react'
import productsData from '../api/productsData'
import { brandsMenu, categoryMenu, sortMenu } from '../api/filterBarData'
import ProductCard from '../components/ProductCard'

function Products({ addedProductIds, onAddToCart }) {
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [sortBy, setSortBy] = useState('Featured')
    const [maxPrice, setMaxPrice] = useState(25000)

    const products = useMemo(() => {
        const filtered = productsData.filter((product) => {
            const brandMatches = !selectedBrands.length || selectedBrands.includes(product.brand)
            const categoryMatches = !selectedCategories.length || selectedCategories.includes(product.category)
            return brandMatches && categoryMatches && product.finalPrice <= maxPrice
        })

        return [...filtered].sort((a, b) => {
            if (sortBy === 'Price(Lowest First)') return a.finalPrice - b.finalPrice
            if (sortBy === 'Price(Highest First)') return b.finalPrice - a.finalPrice
            if (sortBy === 'Top Rated') return b.rateCount - a.rateCount || b.ratings - a.ratings
            if (sortBy === 'Latest') return b.id - a.id
            if (sortBy === 'Featured') return 0
            return 0
        })
    }, [maxPrice, selectedBrands, selectedCategories, sortBy])

    function toggleFilter(setter, current, value) {
        setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
    }

    return (
        <section className='products-page'>
            <div className='products-layout'>
                <aside aria-label='Product filters' className='filter-sidebar'>
                    <div className='filter-group sort-filter'>
                        <h2>Sort By</h2>
                        <div aria-label='Sort products' className='sort-options'>
                            {sortMenu.map((option) => (
                                <button
                                    aria-pressed={sortBy === option.title}
                                    className={sortBy === option.title ? 'sort-option active' : 'sort-option'}
                                    key={option.id}
                                    onClick={() => setSortBy(option.title)}
                                    type='button'
                                >
                                    {option.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='filter-group'>
                        <h2>Filter By</h2>
                        <h3>Brands</h3>
                        {brandsMenu.map(({ id, label }) => (
                            <label className='filter-option' key={id}>
                                <input
                                    checked={selectedBrands.includes(label === 'BoAt' ? 'boAt' : label)}
                                    onChange={() => toggleFilter(setSelectedBrands, selectedBrands, label === 'BoAt' ? 'boAt' : label)}
                                    type='checkbox'
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                    <div className='filter-group'>
                        <h3>Category</h3>
                        {categoryMenu.map(({ id, label }) => (
                            <label className='filter-option' key={id}>
                                <input
                                    checked={selectedCategories.includes(label)}
                                    onChange={() => toggleFilter(setSelectedCategories, selectedCategories, label)}
                                    type='checkbox'
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                    <div className='filter-group'>
                        <label className='price-filter' htmlFor='max-price'>
                            <span>Price</span>
                            <strong>Up to ₹{maxPrice.toLocaleString('en-IN')}</strong>
                        </label>
                        <input
                            id='max-price'
                            max='25000'
                            min='500'
                            onChange={(event) => setMaxPrice(Number(event.target.value))}
                            step='500'
                            type='range'
                            value={maxPrice}
                        />
                    </div>
                    <button
                        className='clear-filters'
                        onClick={() => {
                            setSelectedBrands([])
                            setSelectedCategories([])
                            setMaxPrice(25000)
                            setSortBy('Featured')
                        }}
                        type='button'
                    >
                        Clear filters
                    </button>
                </aside>
                <div aria-live='polite' className='product-grid listing-grid'>
                    {products.map((product) => (
                        <ProductCard addedProductIds={addedProductIds} key={product.id} onAddToCart={onAddToCart} product={product} />
                    ))}
                    {!products.length && <p className='no-products'>No products match these filters.</p>}
                </div>
            </div>
        </section>
    )
}

export default Products
