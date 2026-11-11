import { useMemo, useState } from 'react'
import { FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import productsData from '../api/productsData'

function Navbar({ cartCount }) {
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [accountOpen, setAccountOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const [signupMode, setSignupMode] = useState(false)
    const [loginMessage, setLoginMessage] = useState('')
    const navigate = useNavigate()

    const searchResults = useMemo(() => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) return []
        return productsData.filter((product) =>
            `${product.brand} ${product.title} ${product.info}`.toLowerCase().includes(query)
        ).slice(0, 7)
    }, [searchTerm])

    function selectProduct(product) {
        setSearchOpen(false)
        setSearchTerm('')
        navigate(`/product-details/${product.id}`)
    }

    function submitLogin(event) {
        event.preventDefault()
        setLoginMessage('This demo does not connect to an account service.')
    }

    return (
        <>
            <header className='site-header'>
                <Link className='site-brand' to='/'>Tech-Shop</Link>
                <nav aria-label='Main navigation' className='header-actions'>
                    <button aria-label='Search products' onClick={() => setSearchOpen(true)} type='button'>
                        <FiSearch />
                    </button>
                    <Link aria-label={`Shopping cart, ${cartCount} items`} className='cart-link' to='/cart'>
                        <FiShoppingCart />
                        {cartCount > 0 && <span className='cart-count'>{cartCount}</span>}
                    </Link>
                    <button
                        aria-expanded={accountOpen}
                        aria-label='Account menu'
                        onClick={() => setAccountOpen((open) => !open)}
                        type='button'
                    >
                        <FiUser />
                    </button>
                </nav>
                {accountOpen && (
                    <div className='account-popover'>
                        <strong>Hello!</strong>
                        <p>Access account and manage orders</p>
                        <button
                            className='account-login-button'
                            onClick={() => {
                                setAccountOpen(false)
                                setSignupMode(false)
                                setLoginOpen(true)
                            }}
                            type='button'
                        >
                            Login / Signup
                        </button>
                        <hr />
                        <span>Please Login</span>
                    </div>
                )}
            </header>

            {searchOpen && (
                <div className='search-backdrop' onClick={() => setSearchOpen(false)}>
                    <section
                        aria-label='Search products'
                        aria-modal='true'
                        className='search-dialog'
                        onClick={(event) => event.stopPropagation()}
                        role='dialog'
                    >
                        <div className='search-input-wrap'>
                            <FiSearch />
                            <input
                                autoFocus
                                onChange={(event) => setSearchTerm(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Escape') setSearchOpen(false)
                                    if (event.key === 'Enter' && searchResults[0]) selectProduct(searchResults[0])
                                }}
                                placeholder='Search products...'
                                value={searchTerm}
                            />
                            <button aria-label='Close search' onClick={() => setSearchOpen(false)} type='button'>
                                <FiX />
                            </button>
                        </div>
                        {searchTerm && (
                            <div className='search-results'>
                                {searchResults.length ? searchResults.map((product) => (
                                    <button key={product.id} onClick={() => selectProduct(product)} type='button'>
                                        {product.title}
                                    </button>
                                )) : <p>No products found</p>}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {loginOpen && (
                <div className='modal-backdrop' onClick={() => setLoginOpen(false)}>
                    <section
                        aria-labelledby='login-title'
                        aria-modal='true'
                        className='login-dialog'
                        onClick={(event) => event.stopPropagation()}
                        role='dialog'
                    >
                        <button
                            aria-label='Close login'
                            className='dialog-close'
                            onClick={() => {
                                setLoginOpen(false)
                                setLoginMessage('')
                            }}
                            type='button'
                        >
                            <FiX />
                        </button>
                        <h2 id='login-title'>{signupMode ? 'Signup' : 'Login'}</h2>
                        <p>
                            {signupMode ? 'Already have an account?' : 'New to Tech-Shop?'}
                            {' '}
                            <button
                                className='auth-mode-toggle'
                                onClick={() => {
                                    setSignupMode((mode) => !mode)
                                    setLoginMessage('')
                                }}
                                type='button'
                            >
                                {signupMode ? 'Login' : 'Create an account'}
                            </button>
                        </p>
                        <form onSubmit={submitLogin}>
                            {signupMode && (
                                <label>
                                    <span className='visually-hidden'>Username</span>
                                    <input autoComplete='username' placeholder='Username' required type='text' />
                                </label>
                            )}
                            <label>
                                <span className='visually-hidden'>Email</span>
                                <input autoComplete='email' placeholder='Email' required type='email' />
                            </label>
                            <label>
                                <span className='visually-hidden'>Password</span>
                                <input autoComplete={signupMode ? 'new-password' : 'current-password'} placeholder='Password' required type='password' />
                            </label>
                            {signupMode && (
                                <label>
                                    <span className='visually-hidden'>Confirm Password</span>
                                    <input autoComplete='new-password' placeholder='Confirm Password' required type='password' />
                                </label>
                            )}
                            <button className='button button-primary login-submit' type='submit'>{signupMode ? 'Signup' : 'Login'}</button>
                        </form>
                        {loginMessage && <p className='login-message' role='status'>{loginMessage}</p>}
                        <div className='login-divider'>or login with</div>
                        <div className='social-login'>
                            <button type='button'>Facebook</button>
                            <button type='button'>Google</button>
                            <button type='button'>Twitter</button>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default Navbar
