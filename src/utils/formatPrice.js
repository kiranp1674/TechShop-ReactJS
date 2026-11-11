function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        currency: 'INR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(price)
}

export default formatPrice
