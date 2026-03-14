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
    window.dispatchEvent(new Event("cart:updated"))
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

// Favorites
function getFavorites() {
    const stored = JSON.parse(localStorage.getItem("favorites")) || []
    return Array.isArray(stored) ? stored.map(String) : []
}

function setFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites))
    updateFavoriteCount(favorites)
}

function updateFavoriteCount(favorites) {
    const list = favorites || getFavorites()
    const countFavorite = document.querySelector(".count-favorite")
    if (countFavorite) countFavorite.textContent = list.length
}

function syncFavoriteButtons(favorites) {
    const list = favorites || getFavorites()
    const favoriteIds = new Set(list.map(String))
    const buttons = document.querySelectorAll(".btn_favorite")

    buttons.forEach(button => {
        const id = button.dataset.id
        const icon = button.querySelector("i")
        const isActive = favoriteIds.has(String(id))

        button.classList.toggle("active", isActive)
        if (icon) {
            icon.classList.toggle("fa-solid", isActive)
            icon.classList.toggle("fa-regular", !isActive)
        }
    })
}

function toggleFavorite(productId) {
    if (!productId) return
    const favorites = getFavorites()
    const id = String(productId)
    const index = favorites.indexOf(id)

    if (index >= 0) {
        favorites.splice(index, 1)
    } else {
        favorites.push(id)
    }

    setFavorites(favorites)
    syncFavoriteButtons(favorites)
}

document.addEventListener("click", function (event) {
    const favButton = event.target.closest(".btn_favorite")
    if (!favButton) return
    toggleFavorite(favButton.dataset.id)
})

updateFavoriteCount()

// Mobile menu
const mobileMenu = document.querySelector(".mobile-menu")
const menuOpenButtons = document.querySelectorAll("[data-menu-open]")
const menuCloseButtons = document.querySelectorAll("[data-menu-close]")

function setMobileMenuState(isOpen) {
    if (!mobileMenu) return
    mobileMenu.classList.toggle("active", isOpen)
    document.body.classList.toggle("menu-open", isOpen)
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true")
    menuOpenButtons.forEach(btn => btn.setAttribute("aria-expanded", isOpen ? "true" : "false"))

    if (isOpen) {
        const menuSearch = mobileMenu.querySelector("[data-search-input]")
        if (menuSearch) menuSearch.focus()
    }
}

menuOpenButtons.forEach(button => {
    button.addEventListener("click", () => setMobileMenuState(true))
})

menuCloseButtons.forEach(button => {
    button.addEventListener("click", () => setMobileMenuState(false))
})

if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => {
        const link = event.target.closest(".mobile-nav-links a")
        if (link) {
            setMobileMenuState(false)
        }
    })
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMobileMenuState(false)
    }
})

// Search + Category filtering
const searchForms = document.querySelectorAll("[data-search-form]")
const searchInputs = document.querySelectorAll("[data-search-input]")
const categoryLinks = document.querySelectorAll("[data-filter-category]")
const categorySelects = document.querySelectorAll('select#category')
let currentSearchTerm = ""
let currentCategory = "all"

function normalizeSearch(value) {
    return String(value || "").toLowerCase().trim()
}

const categoryMap = {
    "all categories": "all",
    "electronics & digita": "electronics",
    "phones & tablet": "mobiles",
    "fashion & clothings": "fashion",
    "jewelry & watches": "jewelry",
    "washing & machine": "appliances",
    "toys & hobbies": "toys",
    "top 10 offers": "sale"
}

const categoryOptionMap = (() => {
    const map = new Map()
    categorySelects.forEach(select => {
        Array.from(select.options).forEach(option => {
            const raw = option.value || option.textContent
            const normalized = normalizeSearch(raw)
            const filterValue = categoryMap[normalized] || normalized || "all"
            if (!map.has(filterValue)) {
                map.set(filterValue, option.value || option.textContent)
            }
        })
    })
    if (!map.has("all")) {
        map.set("all", "All Categories")
    }
    return map
})()

function resolveCategoryFilter(value) {
    const normalized = normalizeSearch(value)
    return categoryMap[normalized] || normalized || "all"
}

function applyProductFilters() {
    const normalizedSearch = normalizeSearch(currentSearchTerm)
    const normalizedCategory = normalizeSearch(currentCategory)
    const products = document.querySelectorAll(".product")

    if (!products.length) return

    products.forEach(product => {
        const nameEl = product.querySelector(".name_product")
        const name = normalizeSearch(nameEl ? nameEl.textContent : "")
        const productCategory = normalizeSearch(product.dataset.category)
        const isSale = product.dataset.sale === "true"

        const matchSearch = !normalizedSearch || name.includes(normalizedSearch)
        let matchCategory = true

        if (normalizedCategory && normalizedCategory !== "all") {
            if (normalizedCategory === "sale") {
                matchCategory = isSale
            } else if (productCategory) {
                matchCategory = productCategory === normalizedCategory || name.includes(normalizedCategory)
            } else {
                matchCategory = name.includes(normalizedCategory)
            }
        }

        product.classList.toggle("is-hidden", !(matchSearch && matchCategory))
    })

    const sliders = document.querySelectorAll(".slide_product")
    sliders.forEach(slider => {
        if (slider.swiper && typeof slider.swiper.update === "function") {
            slider.swiper.update()
        }
    })
}

function filterProducts(term) {
    currentSearchTerm = term
    applyProductFilters()
}

function setCategoryFilter(filter) {
    currentCategory = filter || "all"
    applyProductFilters()
}

function syncSearchInputs(value) {
    searchInputs.forEach(input => {
        if (input.value !== value) {
            input.value = value
        }
    })
}

function syncCategorySelects(value) {
    categorySelects.forEach(select => {
        if (select.value !== value) {
            select.value = value
        }
    })
}

function syncCategorySelectsByFilter(filter) {
    const normalized = normalizeSearch(filter || "all")
    const mappedValue = categoryOptionMap.get(normalized)
    if (mappedValue) {
        syncCategorySelects(mappedValue)
    }
}

function updateCategoryActiveState(activeFilter) {
    const normalizedActive = normalizeSearch(activeFilter)
    categoryLinks.forEach(link => {
        const filterValue = normalizeSearch(link.dataset.filterCategory)
        link.classList.toggle("active", normalizedActive !== "all" && filterValue === normalizedActive)
    })
}

searchInputs.forEach(input => {
    input.addEventListener("input", (event) => {
        const value = event.target.value
        syncSearchInputs(value)
        filterProducts(value)
    })
})

searchForms.forEach(form => {
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        const input = form.querySelector("[data-search-input]")
        const value = input ? input.value : ""
        syncSearchInputs(value)
        filterProducts(value)
    })
})

categorySelects.forEach(select => {
    select.addEventListener("change", (event) => {
        const value = event.target.value
        const filter = resolveCategoryFilter(value)
        syncCategorySelects(value)
        setCategoryFilter(filter)
        updateCategoryActiveState(filter)
    })
})

categoryLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault()
        const filter = link.dataset.filterCategory || "all"
        const normalizedFilter = normalizeSearch(filter)
        const isSame = normalizeSearch(currentCategory) === normalizedFilter
        const nextFilter = (isSame && normalizedFilter !== "all") ? "all" : filter

        setCategoryFilter(nextFilter)
        updateCategoryActiveState(nextFilter)
        syncCategorySelectsByFilter(nextFilter)
    })
})

// Re-apply filtering after products load
window.addEventListener("products:rendered", () => {
    applyProductFilters()
    syncFavoriteButtons()
})
