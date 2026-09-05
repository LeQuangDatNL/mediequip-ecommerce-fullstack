users
├── id
├── username
├── email
├── password_hash
├── full_name
├── phone
├── role
├── status
├── created_at
└── updated_at

categories
├── id
├── name
├── slug
├── description
├── status
├── created_at
└── updated_at

products
├── id
├── category_id FK
├── name
├── slug
├── description
├── price
├── stock
├── status
├── created_at
└── updated_at

product_images
├── id
├── product_id FK
├── image_url
├── is_primary
└── created_at

addresses
├── id
├── user_id FK
├── recipient_name
├── phone
├── province
├── district
├── ward
├── address_detail
├── is_default
└── created_at

carts
├── id
├── user_id FK
└── updated_at

cart_items
├── id
├── cart_id FK
├── product_id FK
└── quantity

orders
├── id
├── user_id FK
├── address_id FK
├── total_amount
├── shipping_fee
├── discount_amount
├── final_amount
├── payment_method
├── payment_status
├── order_status
├── note
├── created_at
└── updated_at

order_items
├── id
├── order_id FK
├── product_id FK
├── product_name
├── price
└── quantity

payments
├── id
├── order_id FK
├── transaction_code
├── amount
├── payment_method
├── status
└── paid_at

reviews
├── id
├── user_id FK
├── product_id FK
├── order_id FK
├── rating
├── comment
└── created_at

wishlist
├── id
├── user_id FK
├── product_id FK
└── created_at