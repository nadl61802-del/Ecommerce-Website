fetch("products.json")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("accessories_products")
        if (!container) return

        const products = Array.isArray(data) ? data : []
        if (!products.length) {
            container.innerHTML = `<div class="page-empty">No products available right now.</div>`
            return
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || []
        const cartIds = new Set(cart.map(item => String(item.id)))

        container.innerHTML = ""

        products.forEach(product => {
            const inCart = cartIds.has(String(product.id))
            const btnClass = inCart ? "btn_add_cart active" : "btn_add_cart"
            const btnText = inCart ? "Item in Cart" : "add to cart"
            const categoryAttr = product.catetory || ""
            const saleAttr = product.old_price ? "true" : "false"
            const oldPrice = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : ""
            const saleTag = product.old_price
                ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>`
                : ""

            container.innerHTML += `
            <div class="product" data-category="${categoryAttr}" data-sale="${saleAttr}">
                ${saleTag}
                <div class="img_product">
                    <a href="#"><img src="${product.img}" alt=""></a>
                </div>
                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <p class="name_product"><a href="#">${product.name}</a></p>
                <div class="price">
                    <p><span>$${product.price}</span></p>
                    ${oldPrice}
                </div>
                <div class="icons">
                    <span class="${btnClass}" data-id="${product.id}">
                        <i class="fa-solid fa-cart-shopping"></i> ${btnText}
                    </span>
                    <span class="icon_product btn_favorite" data-id="${product.id}">
                        <i class="fa-regular fa-heart"></i>
                    </span>
                </div>
            </div>
            `
        })

        window.dispatchEvent(new Event("products:rendered"))
    })
