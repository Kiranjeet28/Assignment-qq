
const API_BASE =
    "https://assignment-qq.onrender.com/api";

const productsContainer =
    document.getElementById(
        "products"
    );

const categorySelect =
    document.getElementById(
        "category"
    );

const loadMoreBtn =
    document.getElementById(
        "loadMore"
    );

const filterBtn =
    document.getElementById(
        "filterBtn"
    );

let nextCursor = null;

let selectedCategory = "";

async function loadProducts(
    reset = false
) {
    try {
        let url =
            `${API_BASE}/products?limit=20`;

        if (
            selectedCategory
        ) {
            url +=
                `&category=${selectedCategory}`;
        }

        if (
            nextCursor &&
            !reset
        ) {
            url +=
                `&cursor=${encodeURIComponent(
                    nextCursor
                )}`;
        }

        const response =
            await fetch(url);

        const data =
            await response.json();

        if (reset) {
            productsContainer.innerHTML =
                "";
        }

        data.products.forEach(
            product => {
                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "card";

                div.innerHTML = `
          <h3>${product.name}</h3>

          <p>
            Category:
            ${product.category}
          </p>

          <p>
            Price:
            ₹${product.price}
          </p>

          <p>
            ID:
            ${product.id}
          </p>
        `;

                productsContainer.appendChild(
                    div
                );
            }
        );

        nextCursor =
            data.nextCursor;

        loadMoreBtn.style.display =
            data.hasNextPage
                ? "inline-block"
                : "none";
    } catch (error) {
        console.error(error);
    }
}

filterBtn.addEventListener(
    "click",
    () => {
        selectedCategory =
            categorySelect.value;

        nextCursor = null;

        loadProducts(true);
    }
);

loadMoreBtn.addEventListener(
    "click",
    () => {
        loadProducts();
    }
);

loadProducts(true);