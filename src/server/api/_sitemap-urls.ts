export default cachedEventHandler(
  async () => {
    const [categories, products, pages] = await Promise.all([
      $fetch('/api/categories'),
      $fetch('/api/products'),
      $fetch('/api/pages')
    ])
    const categoriesUrls = categories.map((p) => {
      return {
        name: p.name,
        url: '/category/' + p.slug
      }
    })
    const productsUrls = products.map((p) => {
      return {
        name: p.name,
        url: '/product/' + p.slug
      }
    })
    const pagesUrls = pages.map((p) => {
      return {
        name: p.title,
        url: '/pages/' + p.slug
      }
    })
    return [...categoriesUrls, ...productsUrls, ...pagesUrls]
  },
  {
    name: 'sitemap-dynamic-urls',
    maxAge: 60 * 10
  }
)
