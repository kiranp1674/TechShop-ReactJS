import { useState } from 'react'
import { Link } from 'react-router-dom'
import { footMenu, footSocial } from '../api/footerData'

function Footer() {
    const [subscriptionMessage, setSubscriptionMessage] = useState('')

    function handleSubscribe(event) {
        event.preventDefault()
        setSubscriptionMessage('Email subscriptions are not connected yet.')
    }

    return (
        <footer className='footer'>
            <div className='footer-main'>
                <section className='footer-subscribe'>
                    <h2 className='footer-brand'>Tech-Shop</h2>
                    <p>
                        Subscribe to our Email alerts to receive early discount offers,
                        and new products info.
                    </p>
                    <form className='footer-form' onSubmit={handleSubscribe}>
                        <label className='visually-hidden' htmlFor='footer-email'>
                            Email Address
                        </label>
                        <input
                            id='footer-email'
                            name='email'
                            type='email'
                            placeholder='Email Address*'
                            required
                        />
                        <button type='submit'>Subscribe</button>
                    </form>
                    {subscriptionMessage && (
                        <p className='footer-subscription-message' role='status'>
                            {subscriptionMessage}
                        </p>
                    )}
                </section>

                {footMenu.map((section) => (
                    <section className='footer-menu' key={section.id}>
                        <h3>{section.title}</h3>
                        <ul>
                            {section.menu.map((item) => (
                                <li key={item.id}>
                                    <Link to={item.path}>{item.link}</Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <div className='footer-bottom'>
                <p>2025 | All Rights Reserved &copy;.</p>
                <div className='footer-socials'>
                    {footSocial.map(({ id, icon: Icon, path }) => (
                        <Link
                            aria-label={`Social link ${id}`}
                            key={id}
                            to={path}
                        >
                            <Icon />
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer
