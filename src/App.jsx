import { useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import productsData from './api/productsData'

const CART_STORAGE_KEY = 'tech-shop-cart'

function loadCart() {
  let savedCart

  try {
    savedCart = window.localStorage.getItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Unable to read the saved cart.', error)
    return []
  }

  if (!savedCart) return []

  try {
    const savedItems = JSON.parse(savedCart)
    if (!Array.isArray(savedItems)) {
      console.error('The saved cart has an invalid format.')
      return []
    }

    return savedItems.flatMap((item) => {
      const product = productsData.find((entry) => entry.id === item.productId)
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) return []
      return [{ product, quantity: item.quantity }]
    })
  } catch (error) {
    console.error('Unable to restore the saved cart.', error)
    return []
  }
}

function App() {
  const [cartItems, setCartItems] = useState(loadCart)
  const [addedProductIds, setAddedProductIds] = useState([])
  const [showScrollTop, setShowScrollTop] = useState(false)
  const addedFeedbackTimers = useRef(new Map())

  useEffect(() => {
    function updateScrollButton() {
      setShowScrollTop(window.scrollY > 250)
    }

    window.addEventListener('scroll', updateScrollButton)
    return () => window.removeEventListener('scroll', updateScrollButton)
  }, [])

  useEffect(() => () => {
    addedFeedbackTimers.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    try {
      const savedItems = cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }))
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(savedItems))
    } catch (error) {
      console.error('Unable to save the cart.', error)
    }
  }, [cartItems])

  function addToCart(product) {
    setCartItems((items) => {
      const currentItem = items.find((item) => item.product.id === product.id)
      if (currentItem) {
        return items.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
      }
      return [...items, { product, quantity: 1 }]
    })

    const previousTimer = addedFeedbackTimers.current.get(product.id)
    if (previousTimer) window.clearTimeout(previousTimer)

    setAddedProductIds((ids) => ids.includes(product.id) ? ids : [...ids, product.id])
    const timer = window.setTimeout(() => {
      setAddedProductIds((ids) => ids.filter((id) => id !== product.id))
      addedFeedbackTimers.current.delete(product.id)
    }, 3000)
    addedFeedbackTimers.current.set(product.id, timer)
  }

  function changeQuantity(productId, quantity) {
    setCartItems((items) => items.map((item) => item.product.id === productId
      ? { ...item, quantity: Math.max(1, quantity) }
      : item))
  }

  function removeFromCart(productId) {
    setCartItems((items) => items.filter((item) => item.product.id !== productId))
    const timer = addedFeedbackTimers.current.get(productId)
    if (timer) window.clearTimeout(timer)
    addedFeedbackTimers.current.delete(productId)
    setAddedProductIds((ids) => ids.filter((id) => id !== productId))
  }

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <div className='app-shell'>
      <Navbar cartCount={cartCount} />
      <main className='page-shell'>
        <Routes>
          <Route element={<Home addedProductIds={addedProductIds} cartItems={cartItems} onAddToCart={addToCart} />} path='/' />
          <Route element={<Products addedProductIds={addedProductIds} cartItems={cartItems} onAddToCart={addToCart} />} path='/products' />
          <Route element={<ProductDetails addedProductIds={addedProductIds} cartItems={cartItems} onAddToCart={addToCart} />} path='/product-details/:id' />
          <Route
            element={<Cart cartItems={cartItems} onChangeQuantity={changeQuantity} onRemove={removeFromCart} />}
            path='/cart'
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {showScrollTop && (
        <button
          aria-label='Scroll to top'
          className='scroll-to-top'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type='button'
        >
          <FiArrowUp />
        </button>
      )}
    </div>
  )
}

export default App
