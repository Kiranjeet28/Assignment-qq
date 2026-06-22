CREATE INDEX idx_products_category_created_id
ON products (
    category,
    created_at DESC,
    id DESC
);