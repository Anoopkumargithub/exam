let allMeals = [];

async function fetchMeals(searchTerm = "") {
  try {
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = `
            <div class="loading">Searching for recipes...</div>
        `;

    const response = await fetch(
      "https://dummyjson.com/recipes/search?q=" + searchTerm,
    );
    const data = await response.json();
    allMeals = data.recipes || [];

    if (allMeals.length === 0) {
      productGrid.innerHTML = `
                <div class="error-message">
                    No recipes found matching "${searchTerm}"
                </div>
            `;
      return;
    }

    displayMeals(allMeals);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    document.querySelector(".product-grid").innerHTML = `
            <div class="error-message">
                Failed to load recipes. Please try again later.
            </div>
        `;
  }
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchMeals(searchInput.value), 300);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      clearTimeout(debounceTimer);
      fetchMeals(searchInput.value);
    }
  });
}

function displayMeals(meals) {
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = meals
    .map(
      (meal) => `
                <div class="product-card meal-card">
                    <img src="${meal.image}"
                         alt="${meal.name}"
                         loading="lazy">
                    <h3>${meal.name.substring(0, 30)}${
                      meal.name.length > 30 ? "..." : ""
                    }</h3>
                    <div class="ingredients">
                        <strong>Ingredients:</strong>
                        <small>Ingredients: ${meal.ingredients.join(", ")}</small>
                    </div>
                </div>
            `,
    )
    .join("");
}

function orderMeal(mealId) {
  const meal = allMeals.find((m) => m.id === parseInt(mealId));
  if (meal) {
    alert(`Order placed for ${meal.name}!`);
  }
}

// Initial setup
document.querySelector(".product-grid").innerHTML = `
    <div class="loading">Search for your favorite recipes...</div>
`;

// Setup search when page loads
setupSearch();

// Fetch all recipes initially
fetchMeals("");
