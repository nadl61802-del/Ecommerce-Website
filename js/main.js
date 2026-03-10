let category_nav_list = document.querySelector(".category_nav_list");

function open_categ_list() {
    category_nav_list.classList.toggle("active")
}

var cart = document.querySelector('.cart');

function open_clise_cart() {
    cart.classList.toggle("active")
}

fetch('products.json')
    .then(response => response.json())
    .then(data => {

        updateCart() // 

        document.addEventListener("click", function (event) {

            const button = event.target.closest(".btn_add_cart")

            if (!button) return

            const productId = button.dataset.id

            const selcetedProduct = data.find(product => product.id == productId)

            if (!selcetedProduct) return // 

            addToCart(selcetedProduct)

            const allMathingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)

            allMathingButtons.forEach(btn => {
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

function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items")

    const cart = JSON.parse(localStorage.getItem('cart')) || []

    cartItemsContainer.innerHTML = ""

    cart.forEach((item, index) => {

        cartItemsContainer.innerHTML += `
        <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">$${item.price}</p>
                    <div class="quant_control">
                        <button class="decrease_quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="Increas_quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        `
    })

    const increasButtons = document.querySelectorAll(".Increas_quantity")
    const decreaseButtons = document.querySelectorAll(".decrease_quantity")

    increasButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = Number(event.currentTarget.getAttribute("data-index"))
            if (!Number.isInteger(itemIndex)) return
            increaseQuantity(itemIndex)
        })
    })

    decreaseButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = Number(event.currentTarget.getAttribute("data-index"))
            if (!Number.isInteger(itemIndex)) return
            decreaseQuantity(itemIndex)
        })
    })


    const delteButtons = document.querySelectorAll('.delete_item')

    delteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemIndex = Number(event.currentTarget.getAttribute('data-index'))
            if (!Number.isInteger(itemIndex)) return
            removeFromCart(itemIndex)

        })
    })

    const totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    const totalPrice = cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    )

    const countItemsCart = document.querySelector(".count_items_cart")
    if (countItemsCart) countItemsCart.textContent = totalCount

    const countItemBadge = document.querySelector(".count-item")
    if (countItemBadge) countItemBadge.textContent = totalCount

    const totalPriceEl = document.querySelector(".price_cart_total")
    if (totalPriceEl) totalPriceEl.textContent = `$${totalPrice}`

    syncButtonsWithCart(cart)
}

function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    if (!cart[index]) return
    cart[index].quantity += 1
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
}

function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    if (!cart[index]) return

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1
        localStorage.setItem('cart', JSON.stringify(cart))
        updateCart()
        return
    }

    removeFromCart(index)
}


function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    if (!cart[index]) return
    const remmvoeProduct = cart.splice(index, 1)[0]
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
    updateButtonState(remmvoeProduct.id)

}

function syncButtonsWithCart(cart) {
    const safeCart = Array.isArray(cart) ? cart : (JSON.parse(localStorage.getItem('cart')) || [])
    const cartIds = new Set(safeCart.map(item => String(item.id)))

    const allButtons = document.querySelectorAll(".btn_add_cart")
    allButtons.forEach(button => {
        const id = button.dataset.id
        if (cartIds.has(String(id))) {
            button.classList.add("active")
            button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in Cart`
        } else {
            button.classList.remove("active")
            button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`
        }
    })
}

function updateButtonState(productId) {
    const allMathingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
    allMathingButtons.forEach(button => {
        button.classList.remove('active');
        button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`
    })
}
