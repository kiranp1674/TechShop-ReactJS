const productImageUrls = import.meta.glob('/src/images/products/*.png', {
    eager: true,
    import: 'default',
    query: '?url',
})
const productImageUrlsByName = new Map(
    Object.entries(productImageUrls).map(([path, url]) => [path.split('/').pop().toLowerCase(), url])
)

export function getProductImage(path) {
    const fileName = path.split('/').pop().toLowerCase()
    const imageUrl = productImageUrlsByName.get(fileName)
    if (!imageUrl) {
        throw new Error(`Product image not found: ${fileName}`)
    }
    return imageUrl
}
