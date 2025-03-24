import { CategoryNode } from "@/dtos/category";

export const mockCategoryData: CategoryNode[] = [
    {
        id: 'category-1',
        name: "Electronics",
        description: "Electronic devices and accessories",
        type: "category",
        children: [
            {
                id: 'subcategory-1',
                name: "Smartphones",
                description: "Mobile phones and accessories",
                type: "subcategory",
                children: [
                    {
                        id: 'itemGroup-1',
                        name: "iPhone Models",
                        description: "Apple iPhone models",
                        type: "itemGroup",
                        itemCount: 12,
                    },
                    {
                        id: 'itemGroup-2',
                        name: "Samsung Galaxy",
                        description: "Samsung Galaxy phone models",
                        type: "itemGroup",
                        itemCount: 15,
                    },
                    {
                        id: 'itemGroup-3',
                        name: "Google Pixel",
                        description: "Google Pixel phone models",
                        type: "itemGroup",
                        itemCount: 8,
                    },
                ],
            },
            {
                id: 'subcategory-2',
                name: "Laptops",
                description: "Notebook computers",
                type: "subcategory",
                children: [
                    {
                        id: 'itemGroup-4',
                        name: "MacBooks",
                        description: "Apple MacBook models",
                        type: "itemGroup",
                        itemCount: 6,
                    },
                    {
                        id: 'itemGroup-5',
                        name: "Windows Laptops",
                        description: "Windows-based laptops",
                        type: "itemGroup",
                        itemCount: 18,
                    },
                ],
            },
        ],
    },
    {
        id: 'category-2',
        name: "Clothing",
        description: "Apparel and fashion items",
        type: "category",
        children: [
            {
                id: 'subcategory-3',
                name: "T-Shirts",
                description: "Casual t-shirts",
                type: "subcategory",
                children: [
                    {
                        id: 'itemGroup-6',
                        name: "Men's Graphic Tees",
                        description: "Men's graphic t-shirts",
                        type: "itemGroup",
                        itemCount: 24,
                    },
                    {
                        id: 'itemGroup-7',
                        name: "Women's Basic Tees",
                        description: "Women's basic t-shirts",
                        type: "itemGroup",
                        itemCount: 16,
                    },
                ],
            },
            {
                id: 'subcategory-4',
                name: "Jeans",
                description: "Denim pants",
                type: "subcategory",
                children: [
                    {
                        id: 'itemGroup-8',
                        name: "Men's Slim Jeans",
                        description: "Men's slim fit jeans",
                        type: "itemGroup",
                        itemCount: 14,
                    },
                    {
                        id: 'itemGroup-9',
                        name: "Women's Slim Jeans",
                        description: "Women's slim fit jeans",
                        type: "itemGroup",
                        itemCount: 18,
                    },
                ],
            },
        ],
    },
    {
        id: 'category-3',
        name: "Home & Kitchen",
        description: "Home appliances and kitchenware",
        type: "category",
        children: [
            {
                id: 'subcategory-5',
                name: "Cookware",
                description: "Pots, pans, and cooking utensils",
                type: "subcategory",
                children: [
                    {
                        id: 'itemGroup-10',
                        name: "Non-stick Pans",
                        description: "Non-stick cooking pans",
                        type: "itemGroup",
                        itemCount: 9,
                    },
                    {
                        id: 'itemGroup-11',
                        name: "Stainless Steel Pots",
                        description: "Stainless steel cooking pots",
                        type: "itemGroup",
                        itemCount: 7,
                    },
                ],
            },
        ],
    },
]