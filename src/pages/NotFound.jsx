import {Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className='container section-space text-center'>
        <h1>404 - Page Not Found</h1>
        <p className='text-secondary'> The page you're looking for doesn't exist.</p>
        <Link to='/' className='btn btn-dark'>Go Home</Link>
    </section>
  )
}

export default NotFound