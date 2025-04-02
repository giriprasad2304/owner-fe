// Fetch and display orders
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3005/api/orders');
        const orders = await response.json();
        console.log('Orders fetched:', orders); // Debugging log

        const ordersContainer = document.getElementById('orders');
        ordersContainer.innerHTML = ''; // Clear existing content

        if (orders.length === 0) {
            // Display "No orders" message if the orders array is empty
            ordersContainer.innerHTML = '<p>No orders available.</p>';
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';
            orderDiv.innerHTML = `
                <p><strong>Name on the cake:</strong> ${order.consumer}</p>
                <p><strong>Quantity:</strong> ${order.quantity} Kg</p>
                <p><strong>Flavour:</strong> ${order.flavour}</p>
                <p><strong>Delivery Time:</strong> ${order.info}</p>
                <button class="delete-btn" data-phone="${order.phone}">Mark as Delivered</button>
            `;
            ordersContainer.appendChild(orderDiv);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const phone = event.target.getAttribute('data-phone');
                console.log('Deleting order with phone:', phone); // Debugging log
                const enteredPhone = prompt('Enter the phone number to confirm deletion:');
                if (enteredPhone === phone) {
                    await deleteOrder(phone);
                    fetchOrders(); // Refresh the orders list
                } else {
                    alert('Incorrect phone number. Order not deleted.');
                }
            });
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Delete an order by phone number
async function deleteOrder(phone) {
    try {
        const response = await fetch('http://localhost:3005/api/orders', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        });
        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
        } else {
            console.error(result.error);
            alert(result.error);
        }
    } catch (error) {
        console.error('Error deleting order:', error);
    }
}

// Fetch categories and populate the category dropdown
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:3005/api/menu/categories');
        const categories = await response.json();

        const categoryDropdown = document.getElementById('category');
        categoryDropdown.innerHTML = '<option value="" disabled selected>Select a category</option>'; // Reset options

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category;
            option.textContent = category.category;
            categoryDropdown.appendChild(option);
        });

        // Add event listener to populate items when a category is selected
        categoryDropdown.addEventListener('change', () => populateItems(categories));
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Populate the items dropdown based on the selected category
function populateItems(categories) {
    const selectedCategory = document.getElementById('category').value;
    const itemsDropdown = document.getElementById('itemName');
    itemsDropdown.innerHTML = '<option value="" disabled selected>Select an item</option>'; // Reset options

    const category = categories.find(cat => cat.category === selectedCategory);
    if (category) {
        category.items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            itemsDropdown.appendChild(option);
        });
    }
}

// Handle form submission to update quantity
document.getElementById('update-quantity-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const itemName = document.getElementById('itemName').value;
    const newQuantity = parseInt(document.getElementById('newQuantity').value);

    try {
        const response = await fetch('http://localhost:3005/api/menu/update-quantity', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, itemName, newQuantity }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('update-message').textContent = result.message;
        } else {
            document.getElementById('update-message').textContent = result.error;
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        document.getElementById('update-message').textContent = 'Failed to update quantity';
    }
});

// Fetch orders and categories on page load
window.onload = () => {
    fetchOrders();
    fetchCategories();
};



// Handle form submission to add a new item
document.getElementById('add-item-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const category = document.getElementById('newCategory').value;
    const name = document.getElementById('newItemName').value;
    const price = document.getElementById('newPrice').value;
    const image = document.getElementById('newImage').value;
    const quantity = parseInt(document.getElementById('newQuantity').value);

    try {
        const response = await fetch('http://localhost:3005/api/menu/add-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, name, price, image, quantity }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('add-item-message').textContent = result.message;
            document.getElementById('add-item-message').style.color = 'green';
        } else {
            document.getElementById('add-item-message').textContent = result.error;
            document.getElementById('add-item-message').style.color = 'red';
        }
    } catch (error) {
        console.error('Error adding item:', error);
        document.getElementById('add-item-message').textContent = 'Failed to add item';
        document.getElementById('add-item-message').style.color = 'red';
    }
});