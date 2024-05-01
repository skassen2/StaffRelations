const form = document.getElementById("mealForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mealName = document.getElementById("mealName").value.trim();
    const mealDescription = document.getElementById("mealDescription").value.trim();
    const mealImageUrl = document.getElementById("mealImageUrl").value.trim();

    if (mealName === '' || mealDescription === '' || mealImageUrl === '') {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const mealData = {
            meal_name: mealName,
            description: mealDescription,
            created_by: localStorage.getItem('username'), // Get the logged-in HR user
            meal_image_url: mealImageUrl
        };

        const response = await fetch('/data-api/rest/Meal_menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mealData)
        });

        if (response.ok) {
            alert("Meal created successfully!");
            // Clear the form fields after successful submission
            form.reset();
        } else {
            throw new Error('Failed to create meal.');
        }
    } catch (error) {
        console.error('Error creating meal:', error);
        alert("An error occurred while creating the meal. Please try again later.");
    }
});
