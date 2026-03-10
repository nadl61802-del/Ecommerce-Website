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

    updateCart() // âœï¸ FIX 1: ØªØ­Ø¯ÙŠØ« Ø§Ù„ÙƒØ§Ø±Øª Ø£ÙˆÙ„ Ù…Ø§ Ø§Ù„Ø¯Ø§ØªØ§ ØªÙŠØ¬ÙŠ

    document.addEventListener("click", function(event){

        const button = event.target.closest(".btn_add_cart")

        if(!button) return

        const productId = button.dataset.id

        const selcetedProduct = data.find(product => product.id == productId)

        if(!selcetedProduct) return // âœï¸ FIX 2: Ù„Ùˆ Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ø´ Ù…ÙˆØ¬ÙˆØ¯ Ù…ØªÙƒÙ…Ù„Ø´

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

    if(existingProduct){
        existingProduct.quantity += 1
    }else{
        cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    updateCart()
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
        </div>
        `
    })
}
