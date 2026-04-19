export function generateRandomEmail(){
    return`test${Date.now()}@test.com`;
}

export const categories = [
    "Fresh Produce",
    "Dairy and Eggs",
    "Bakery",
    "Snacks and Beverages",
    "Grocery Staples",
    "Packaged Foods",
    "Frozen Foods",
    "Personal Care",
    "Health and Wellness",
    "Baby Care",
    "Cleaning Supplies",
    "Household Essentials",
    "Organic Foods",
    "Spices and Condiments",
    "Instant Meals",
    "Cooking Oils",
    "International Foods",
];

export const catNav = [
    {
        name: "Bakery",
        icon: "bakery",
    },
    {
        name: "Packaged Foods",
        icon: "candy"   ,
    },
    {
        name: "Snacks and Beverages",
        icon: "drinks",
    },
    {
        name: "Household Essentials",
        icon: "essentials",
    },
    {
        name: "Frozen Foods",
        icon: "meat",
    },
    {
        name: "Dairy and Eggs",
        icon: "milk",
    },
    {
        name: "International Foods",
        icon: "snacks",
    },
    {
        name: "Fresh Produce",
        icon: "vegetables",
    },
]

export const adminLabels = [
  "Dashboard",
  "Orders",
  "Products",
  "Add Product",
  "Users",
  "Reviews",
  "My Profile",
  "Logout"
];