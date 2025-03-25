import { CategoryDto, SubCategoryDto, ItemGroupDto } from "@/dtos/category";

export const mockCategories: CategoryDto[] = [
    {
        id: "cat1",
        name: "Electronics",
        description: "Electronic devices and accessories"
    },
    {
        id: "cat2",
        name: "Clothing",
        description: "Fashion and apparel"
    }
];

export const mockSubCategories: SubCategoryDto[] = [
    {
        id: "sub1",
        name: "Smartphones",
        description: "Mobile phones and accessories",
        category_id: "cat1"
    },
    {
        id: "sub2",
        name: "Laptops",
        description: "Notebooks and accessories",
        category_id: "cat1"
    },
    {
        id: "sub3",
        name: "Men's Wear",
        description: "Clothing for men",
        category_id: "cat2"
    },
    {
        id: "sub4",
        name: "Women's Wear",
        description: "Clothing for women",
        category_id: "cat2"
    }
];

export const mockItemGroups: ItemGroupDto[] = [
    {
        id: "ig1",
        name: "iPhone",
        description: "Apple smartphones",
        sub_category_id: "sub1"
    },
    {
        id: "ig2",
        name: "Samsung",
        description: "Samsung smartphones",
        sub_category_id: "sub1"
    },
    {
        id: "ig3",
        name: "Gaming Laptops",
        description: "High-performance gaming laptops",
        sub_category_id: "sub2"
    },
    {
        id: "ig4",
        name: "Business Laptops",
        description: "Professional business laptops",
        sub_category_id: "sub2"
    },
    {
        id: "ig5",
        name: "T-Shirts",
        description: "Casual t-shirts for men",
        sub_category_id: "sub3"
    },
    {
        id: "ig6",
        name: "Dresses",
        description: "Women's dresses",
        sub_category_id: "sub4"
    }
]; 