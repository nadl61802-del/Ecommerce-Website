const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyM-H42Kwx3PDEkEdRaJ8GqH069-SQqo6h0LDP9LpVnufvC6Mmd_CrGOgRf2jOhXXLllQ/exec"

function formatPrice(value) {
    const safe = Number(value) || 0
    return `$${safe.toFixed(2)}`
}

function getCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    return Array.isArray(cart) ? cart : []
}

function getShippingCost() {
    const selected = document.querySelector('input[name="shipping"]:checked')
    if (!selected) return 0
    const cost = Number(selected.dataset.shipping)
    return Number.isFinite(cost) ? cost : 0
}

function renderCheckoutSummary() {
    const summaryItems = document.getElementById("checkout_items")
    const subtotalEl = document.getElementById("checkout_subtotal")
    const shippingEl = document.getElementById("checkout_shipping")
    const taxEl = document.getElementById("checkout_tax")
    const totalEl = document.getElementById("checkout_total")
    const countEl = document.getElementById("checkout_count")
    const placeOrderBtn = document.getElementById("place_order")

    if (!summaryItems || !subtotalEl || !shippingEl || !taxEl || !totalEl || !countEl) return

    const cart = getCartItems()
    const itemsCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    const subtotal = cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    )

    summaryItems.innerHTML = ""

    if (!cart.length) {
        summaryItems.innerHTML = `<p class="summary-empty">Your cart is empty.</p>`
        if (placeOrderBtn) placeOrderBtn.disabled = true
    } else {
        cart.forEach(item => {
            summaryItems.innerHTML += `
            <div class="summary-item" data-id="${item.id}">
                <img src="${item.img}" alt="">
                <div class="summary-info">
                    <div class="title">${item.name}</div>
                    <div class="summary-controls">
                        <button type="button" class="qty-btn" data-action="decrease">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button type="button" class="qty-btn" data-action="increase">+</button>
                        <button type="button" class="remove-btn" data-action="remove">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <div class="price">${formatPrice(Number(item.price) * Number(item.quantity))}</div>
            </div>
            `
        })
        if (placeOrderBtn) placeOrderBtn.disabled = false
    }

    const shipping = cart.length ? getShippingCost() : 0
    const tax = cart.length ? 0 : 0
    const total = subtotal + shipping + tax

    countEl.textContent = itemsCount
    subtotalEl.textContent = formatPrice(subtotal)
    shippingEl.textContent = formatPrice(shipping)
    taxEl.textContent = formatPrice(tax)
    totalEl.textContent = formatPrice(total)
}

function updateCartStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
    if (typeof updateCart === "function") {
        updateCart()
        return
    }
    window.dispatchEvent(new Event("cart:updated"))
}

function setupSummaryActions() {
    const summaryItems = document.getElementById("checkout_items")
    if (!summaryItems) return

    summaryItems.addEventListener("click", (event) => {
        const actionBtn = event.target.closest("[data-action]")
        if (!actionBtn) return

        const itemEl = actionBtn.closest(".summary-item")
        if (!itemEl) return

        const id = String(itemEl.dataset.id || "")
        if (!id) return

        const cart = getCartItems()
        const index = cart.findIndex(item => String(item.id) === id)
        if (index === -1) return

        const action = actionBtn.dataset.action

        if (action === "increase") {
            cart[index].quantity = (Number(cart[index].quantity) || 0) + 1
        } else if (action === "decrease") {
            const currentQty = Number(cart[index].quantity) || 0
            if (currentQty > 1) {
                cart[index].quantity = currentQty - 1
            } else {
                cart.splice(index, 1)
            }
        } else if (action === "remove") {
            cart.splice(index, 1)
        }

        updateCartStorage(cart)
        renderCheckoutSummary()
    })
}

function setupPaymentToggle() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]')
    const cardFields = document.querySelector("[data-card-fields]")
    if (!cardFields || !paymentOptions.length) return

    const updateVisibility = () => {
        const selected = document.querySelector('input[name="payment"]:checked')
        const showCard = selected && selected.value === "card"
        cardFields.style.display = showCard ? "grid" : "none"
    }

    paymentOptions.forEach(option => {
        option.addEventListener("change", updateVisibility)
    })

    updateVisibility()
}

function setupShippingListener() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]')
    shippingOptions.forEach(option => {
        option.addEventListener("change", renderCheckoutSummary)
    })
}

function collectCheckoutData() {
    const form = document.getElementById("checkout_form")
    const cart = getCartItems()
    const formData = form ? new FormData(form) : new FormData()
    const data = Object.fromEntries(formData.entries())

    const shippingSelected = document.querySelector('input[name="shipping"]:checked')
    const shippingMethod = shippingSelected ? shippingSelected.value : ""
    const shippingCost = shippingSelected ? Number(shippingSelected.dataset.shipping) || 0 : 0

    const subtotal = cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    )
    const tax = 0
    const total = subtotal + shippingCost + tax

    return {
        ...data,
        shipping: shippingMethod,
        shipping_cost: shippingCost,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 0
        })),
        subtotal,
        tax,
        total
    }
}

function setupCheckoutSubmit() {
    const form = document.getElementById("checkout_form")
    const placeOrderBtn = document.getElementById("place_order")
    if (!form || !placeOrderBtn) return

    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const cart = getCartItems()
        if (!cart.length) return
        if (typeof form.reportValidity === "function" && !form.reportValidity()) return

        placeOrderBtn.disabled = true
        const originalText = placeOrderBtn.textContent
        placeOrderBtn.textContent = "Sending..."

        try {
            const payload = collectCheckoutData()
            const formBody = new URLSearchParams()
            Object.entries(payload).forEach(([key, value]) => {
                if (value === undefined || value === null) return
                if (typeof value === "object") {
                    formBody.append(key, JSON.stringify(value))
                } else {
                    formBody.append(key, String(value))
                }
            })

            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: formBody
            })

            const text = await response.text()
            let result = null
            try {
                result = JSON.parse(text)
            } catch (err) {
                result = null
            }

            if (result && result.result === "success") {
                localStorage.removeItem("cart")
                if (typeof updateCart === "function") {
                    updateCart()
                }
                form.reset()
                renderCheckoutSummary()
                placeOrderBtn.textContent = originalText
                return
            }

            placeOrderBtn.disabled = false
            placeOrderBtn.textContent = originalText
            const message = (result && result.error) ? result.error : (text || "حدث خطأ أثناء إرسال الطلب.")
            alert(message)
        } catch (err) {
            placeOrderBtn.disabled = false
            placeOrderBtn.textContent = originalText
            alert("تعذر الاتصال بالخادم. حاول مرة أخرى.")
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutSummary()
    setupPaymentToggle()
    setupShippingListener()
    setupSummaryActions()
    setupCheckoutSubmit()
})

window.addEventListener("cart:updated", () => {
    renderCheckoutSummary()
})
