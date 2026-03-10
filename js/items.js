// items.js - الكود الكامل بعد الدمج

fetch('products.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const cart = JSON.parse(localStorage.getItem('cart')) || []
        const cartIds = new Set(cart.map(item => String(item.id)))
        const swiper_items_sale = document.getElementById("swiper_items_sale")
        const swiper_tepols = document.getElementById("swiper_tepols")
        const swiper_Appliances = document.getElementById("swiper_Appliances")
        const swiper_mobiles = document.getElementById("swiper_mobiles")

        data.forEach(product => {
            if (product.old_price) {
                const inCart = cartIds.has(String(product.id))
                const btnClass = inCart ? "btn_add_cart active" : "btn_add_cart"
                const btnText = inCart ? "Item in Cart" : "add to cart"
                const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100)
                swiper_items_sale.innerHTML += `
                <div class="swiper-slide product">
                    <span class="sale_present">%${percent_disc}</span>
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
                        <p class="old_price">$${product.old_price}</p>
                    </div>
                    <div class="icons">
                        <span class="${btnClass}" data-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${btnText}
                        </span>
                        <span class="icon_product">
                            <i class="fa-regular fa-heart"></i>
                        </span>
                    </div>
                </div>`
            }
        });

        data.forEach(product => {
            if (product.catetory == "electronics") {
                const inCart = cartIds.has(String(product.id))
                const btnClass = inCart ? "btn_add_cart active" : "btn_add_cart"
                const btnText = inCart ? "Item in Cart" : "add to cart"
                const old_price_pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : "";
                const old_price_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";
                swiper_tepols.innerHTML += `
                <div class="swiper-slide product">
                    ${old_price_div}
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
                        ${old_price_pargrahp}
                    </div>
                    <div class="icons">
                        <span class="${btnClass}" data-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${btnText}
                        </span>
                        <span class="icon_product">
                            <i class="fa-regular fa-heart"></i>
                        </span>
                    </div>
                </div>`
            }
        });

        data.forEach(product => {
            if (product.catetory == "appliances") {
                const inCart = cartIds.has(String(product.id))
                const btnClass = inCart ? "btn_add_cart active" : "btn_add_cart"
                const btnText = inCart ? "Item in Cart" : "add to cart"
                const old_price_pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : "";
                const old_price_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";
                swiper_Appliances.innerHTML += `
                <div class="swiper-slide product">
                    ${old_price_div}
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
                        ${old_price_pargrahp}
                    </div>
                    <div class="icons">
                        <span class="${btnClass}" data-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${btnText}
                        </span>
                        <span class="icon_product">
                            <i class="fa-regular fa-heart"></i>
                        </span>
                    </div>
                </div>`
            }
        });

        data.forEach(product => {
            if (product.catetory == "mobiles") {
                const inCart = cartIds.has(String(product.id))
                const btnClass = inCart ? "btn_add_cart active" : "btn_add_cart"
                const btnText = inCart ? "Item in Cart" : "add to cart"
                const old_price_pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : "";
                const old_price_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";
                swiper_mobiles.innerHTML += `
                <div class="swiper-slide product">
                    ${old_price_div}
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
                        ${old_price_pargrahp}
                    </div>
                    <div class="icons">
                        <span class="${btnClass}" data-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${btnText}
                        </span>
                        <span class="icon_product">
                            <i class="fa-regular fa-heart"></i>
                        </span>
                    </div>
                </div>`
            }
        });

        // ✏️ FIX: event listener هنا جوه الـ fetch عشان data متاحة
        updateCart()

        document.addEventListener("click", function (event) {
            const clearBtn = event.target.closest(".clear_cart")
            if (clearBtn) {
                clearCart()
                return
            }

            const button = event.target.closest(".btn_add_cart")
            if (!button) return

            const productId = Number(button.dataset.id)
            if (!Number.isFinite(productId)) return

            const selectedProduct = data.find(product => product.id === productId)
            if (!selectedProduct) return

            addToCart(selectedProduct)

            const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
            allMatchingButtons.forEach(btn => {
                btn.classList.add("active")
                btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in Cart`
            })
        })
    })

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    const existingProduct = cart.find(item => item.id == product.id)

    if (existingProduct) {
        existingProduct.quantity += 1
    } else {
        cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
}


function clearCart() {
    localStorage.removeItem('cart')
    updateCart()

    document.querySelectorAll(".btn_add_cart").forEach(btn => {
        btn.classList.remove("active")
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`
    })
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items")
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    cartItemsContainer.innerHTML = ""

    cart.forEach((item) => {
        cartItemsContainer.innerHTML += `
        <div class="item_cart">
            <img src="${item.img}" alt="">
            <div class="content">
                <h4>${item.name}</h4>
                <p class="price_cart">$${item.price}</p>
                <div class="quant_control">
                    <button class="decrease_quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="Increas_quantity">+</button>
                </div>
            </div>
            <button class="delete_item"><i class="fa-solid fa-trash-can"></i></button>
        </div>`
    })
}
