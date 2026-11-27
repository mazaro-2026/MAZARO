let cart = JSON.parse(localStorage.getItem("mazaroCart")) || [];


function addToCart(productName, sizeId) {
    const size = document.getElementById(sizeId).value;

    if (size === "") {
        alert("من فضلك اختر المقاس أولاً");
        return;
    }

    const existingItem = cart.find(item =>
        item.name === productName && item.size === size
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            size: size,
            price: 499,
            quantity: 1
        });
    }

    saveCart();
    displayCart();

    document.getElementById("cart").classList.add("active");
document.getElementById("cart-overlay").classList.add("active");

    alert("تمت إضافة المنتج إلى السلة بنجاح");
}
function saveCart() {
    localStorage.setItem("mazaroCart", JSON.stringify(cart));
}


function toggleCart() {
    document.getElementById("cart").classList.toggle("active");

    document.getElementById("cart-overlay").classList.toggle("active");
}



function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <tr>
                <td colspan="6">حقيبتك فارغة حالياً</td>
            </tr>
        `;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        count += item.quantity;

        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>${item.price} EGP</td>
                <td>
                    <button onclick="changeQuantity(${index}, -1)">−</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>${itemTotal} EGP</td>
                <td>
                    <button onclick="removeItem(${index})">حذف</button>
                </td>
            </tr>
        `;
    });

    cartTotal.textContent = total;
    cartCount.textContent = count;
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);

    saveCart();
    displayCart();
}


function clearCart() {
    if (cart.length === 0) {
        alert("السلة فارغة بالفعل");
        return;
    }

    const confirmed = confirm("هل أنت متأكد من حذف جميع المنتجات من السلة؟");

    if (!confirmed) {
        return;
    }

    cart = [];

    saveCart();
    displayCart();

    alert("تم تفريغ السلة بنجاح");
}

function checkout() {

    if (cart.length === 0) {
        alert("السلة فارغة");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phoneNumber = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const notes = document.getElementById("customer-notes").value.trim();

    if (!name || !phoneNumber || !address) {
        alert("من فضلك أكمل الاسم ورقم الهاتف والعنوان");
        return;
    }

    if (!/^[0-9+\s-]{10,20}$/.test(phoneNumber)) {
        alert("من فضلك أدخل رقم هاتف صحيح");
        return;
    }

    let total = 0;

    let message =
        "MAZARO SIGNATURE - NEW ORDER\n\n" +
        "بيانات العميل:\n" +
        "الاسم: " + name + "\n" +
        "الهاتف: " + phoneNumber + "\n" +
        "العنوان: " + address + "\n\n" +
        "تفاصيل الطلب:\n";

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        message +=
            "\nالمنتج: " + item.name +
            "\nالمقاس: " + item.size +
            "\nالكمية: " + item.quantity +
            "\nالسعر: " + itemTotal + " EGP\n";

        total += itemTotal;
    });

    message += "\nإجمالي الطلب: " + total + " EGP";

    if (notes) {
        message += "\nملاحظات العميل: " + notes;
    }

    const phone = "201016456011";

    const url =
        "https://wa.me/" + phone +
        "?text=" + encodeURIComponent(message);

    window.open(url, "_blank");
}
displayCart();

// حفظ بيانات العميل
function saveCustomerDetails() {
    const customer = {
        name: document.getElementById("customer-name")?.value || "",
        phone: document.getElementById("customer-phone")?.value || "",
        address: document.getElementById("customer-address")?.value || "",
        notes: document.getElementById("customer-notes")?.value || ""
    };

    localStorage.setItem("mazaroCustomer", JSON.stringify(customer));
}

// استرجاع بيانات العميل
function loadCustomerDetails() {
    const customer = JSON.parse(
        localStorage.getItem("mazaroCustomer")
    ) || {};

    if (document.getElementById("customer-name"))
        document.getElementById("customer-name").value = customer.name || "";

    if (document.getElementById("customer-phone"))
        document.getElementById("customer-phone").value = customer.phone || "";

    if (document.getElementById("customer-address"))
        document.getElementById("customer-address").value = customer.address || "";

    if (document.getElementById("customer-notes"))
        document.getElementById("customer-notes").value = customer.notes || "";
}

// حفظ البيانات مع كل كتابة
document.addEventListener("input", function(event) {
    const fields = [
        "customer-name",
        "customer-phone",
        "customer-address",
        "customer-notes"
    ];

    if (fields.includes(event.target.id)) {
        saveCustomerDetails();
    }
});

// استرجاع البيانات عند فتح الصفحة
loadCustomerDetails();
