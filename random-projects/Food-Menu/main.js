const foods = [
    {
        name: 'Buttermilk Pancakes',
        price: '$15.99',
        description: 'Fluffy buttermilk pancakes served with syrup and butter.',
        image: 'https://cdn.pixabay.com/photo/2023/02/24/21/11/pancake-7811889_640.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Avocado Toast',
        price: '$9.99',
        description: 'Toasted bread topped with mashed avocado, cherry tomatoes, and a sprinkle of feta cheese.',
        image: 'https://cdn.pixabay.com/photo/2021/11/08/15/57/avocado-toast-6779457_640.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Breakfast Burrito',
        price: '$11.99',
        description: 'Tortilla filled with scrambled eggs, sausage, cheese, and salsa.',
        image: 'https://cdn.pixabay.com/photo/2020/06/01/15/37/tortilla-5247120_640.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Classic Burger',
        price: '$12.99',
        description: 'Juicy beef patty with lettuce, tomato, cheese, and a side of fries.',
        image: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_640.jpg',
        category: 'Lunch'
    },
    {
        name: 'Caesar Salad',
        price: '$10.99',
        description: 'Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan cheese.',
        image: 'https://cdn.pixabay.com/photo/2021/01/10/04/37/salad-5904093_640.jpg',
        category: 'Lunch'
    },
    {
        name: 'Turkey Club Sandwich',
        price: '$13.99',
        description: 'Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo.',
        image: 'https://cdn.pixabay.com/photo/2013/11/22/12/23/club-215639_640.jpg',
        category: 'Lunch'
    },
    {
        name: 'Tacos al Pastor',
        price: '$11.99',
        description: 'Three tacos with marinated pork, pineapple, onions, and cilantro.',
        image: 'https://cdn.pixabay.com/photo/2019/09/26/04/01/tacos-pastor-4505032_640.jpg',
        category: 'Lunch'
    },
    {
        name: 'French Onion Soup',
        price: '$8.99',
        description: 'Rich beef broth with caramelized onions, topped with melted cheese and croutons.',
        image: 'https://cdn.pixabay.com/photo/2024/02/21/06/48/ai-generated-8586856_640.png',
        category: 'Lunch'
    },
    {
        name: 'Grilled Chicken Wrap',
        price: '$10.99',
        description: 'Grilled chicken, lettuce, tomato, and ranch dressing wrapped in a flour tortilla.',
        image: 'https://img.freepik.com/free-photo/doner-wrapped-lavash-fries_141793-84.jpg?w=740&t=st=1719143181~exp=1719143781~hmac=b5643074af687625aeb13266fa6c7e370d5b93bec677bca6a396883a18894e5d',
        category: 'Lunch'
    },
    {
        name: 'Margherita Pizza',
        price: '$14.99',
        description: 'Traditional pizza topped with fresh tomatoes, mozzarella, and basil.',
        image: 'https://cdn.pixabay.com/photo/2019/11/30/05/34/pizza-4662567_640.jpg',
        category: 'Dinner'
    },
    {
        name: 'Grilled Salmon',
        price: '$18.99',
        description: 'Grilled salmon fillet served with a lemon butter sauce and steamed vegetables.',
        image: 'https://cdn.pixabay.com/photo/2018/11/19/12/10/grilled-3825149_640.jpg',
        category: 'Dinner'
    },
    {
        name: 'Chicken Alfredo Pasta',
        price: '$16.99',
        description: 'Fettuccine pasta tossed in creamy Alfredo sauce with grilled chicken.',
        image: 'https://img.freepik.com/free-photo/penne-with-cheese-cream_140725-376.jpg?t=st=1719143412~exp=1719147012~hmac=fc6e01d8c1d45082de33b627e837f03d70a41d020d0de9a74011c756b4c4933d&w=996',
        category: 'Dinner'
    },
    {
        name: 'Beef Stroganoff',
        price: '$17.99',
        description: 'Tender beef in a creamy mushroom sauce served over egg noodles.',
        image: 'https://img.freepik.com/free-photo/top-view-baked-liver-onion-oval-plate_140725-99800.jpg?t=st=1719143451~exp=1719147051~hmac=7183894357483952e9b8f05a85b74107a34d38398287cd8845a0b6ebaa054fc8&w=996',
        category: 'Dinner'
    },
    {
        name: 'Stuffed Bell Peppers',
        price: '$15.99',
        description: 'Bell peppers stuffed with rice, ground beef, and tomato sauce, topped with cheese.',
        image: 'https://img.freepik.com/free-photo/front-view-cooked-bell-peppers-with-ground-meat-grey-surface-meal-dolma-beef-food-vegetables-meat_140725-74283.jpg?t=st=1719143523~exp=1719147123~hmac=5beb70b25d1c94b15ce9b00f797ebb5e29bd4924f1b947f2ebe30b19b60770f4&w=996',
        category: 'Dinner'
    },
    {
        name: 'Chocolate Lava Cake',
        price: '$7.99',
        description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
        image: 'https://img.freepik.com/free-photo/closeup-shot-chocolate-cake-wooden-table_181624-29011.jpg?t=st=1719143571~exp=1719147171~hmac=9202e5577b4e3b7e100b53aeaa5cfda3de423967dd0e526ef68979d389d9c5a6&w=996',
        category: 'Dessert'
    },
    {
        name: 'New York Cheesecake',
        price: '$8.99',
        description: 'Creamy cheesecake with a graham cracker crust, topped with strawberry sauce.',
        image: 'https://img.freepik.com/free-photo/slice-cheesecake-with-chocolate-strawberry-syrup_114579-3404.jpg?t=st=1719143607~exp=1719147207~hmac=42298572880e16fbe75942008105889ee899cda4be09c9907b3001d61fe180fb&w=740',
        category: 'Dessert'
    },
    {
        name: 'Strawberry Banana Shake',
        price: '$6.99',
        description: 'Creamy shake made with fresh strawberries, bananas, and vanilla ice cream.',
        image: 'https://img.freepik.com/free-photo/strawberry-smoothie-with-waffles-chocolate-white-plate-marble-surface_114579-33857.jpg?t=st=1719143674~exp=1719147274~hmac=2a9cdb0ddc4f15880eeda67b32e3bcac7a685ae6d07bd348138ea6ebce0161c7&w=996',
        category: 'Shakes'
    },
    {
        name: 'Chocolate Milkshake',
        price: '$5.99',
        description: 'Classic milkshake made with rich chocolate ice cream and milk.',
        image: 'https://img.freepik.com/free-photo/front-view-chocolate-milkshake-with-pretzels-copy-space_23-2148707842.jpg?t=st=1719143720~exp=1719147320~hmac=5c9087523ec03a04921311791b8c84eaa5dfc6d550490eda56e3eabcd9c49f47&w=996',
        category: 'Shakes'
    },
    {
        name: 'Blueberry Smoothie',
        price: '$5.99',
        description: 'Healthy smoothie made with blueberries, yogurt, and a touch of honey.',
        image: 'https://img.freepik.com/free-photo/blueberry-smoothie-close-up-shot_53876-18251.jpg?t=st=1719143767~exp=1719147367~hmac=b78690a0410cd54f0ded59d2236388eb84a1acf99bd1f0d7cbac7429afb4a918&w=740',
        category: 'Shakes'
    },
    {
        name: 'Mango Lassi',
        price: '$4.99',
        description: 'Refreshing Indian yogurt drink made with ripe mangoes and a hint of cardamom.',
        image: 'https://img.freepik.com/free-photo/homemade-mango-yoghurt-marble-surface_1150-41965.jpg?t=st=1719143807~exp=1719147407~hmac=7269c9238cbe75a5e3ffcc6f75b70c8b01f987575e87b8db4f148f432012f5d0&w=740',
        category: 'Shakes'
    }
];

let menu = document.getElementById('food-display');
let All = document.getElementById('all');
let Breakfast = document.getElementById('breakfast');
let Lunch = document.getElementById('lunch');
let Dinner = document.getElementById('dinner');
let Shakes = document.getElementById('shakes');
let Dessert = document.getElementById('dessert');

function filterByCategory(category) {
    if (category === 'All') {
        displayFoodItems(foods);
    } else {
        const filteredFoods = foods.filter(foodItem => foodItem.category === category);
        displayFoodItems(filteredFoods);
    }
}

All.addEventListener('click', () => filterByCategory('All'));
Breakfast.addEventListener('click', () => filterByCategory('Breakfast'));
Lunch.addEventListener('click', () => filterByCategory('Lunch'));
Dinner.addEventListener('click', () => filterByCategory('Dinner'));
Shakes.addEventListener('click', () => filterByCategory('Shakes'));
Dessert.addEventListener('click', () => filterByCategory('Dessert'));

function displayFoodItems(filteredFoods) {
    menu.innerHTML = '';
    filteredFoods.forEach(foodItem => {
        menu.innerHTML += `<div id="food">
<img src="${foodItem.image}">
<div>
<span id="food-details">
<p id="name">${foodItem.name}</p>
<p id="price">${foodItem.price}</p>
</span>
<p id="description">${foodItem.description}</p>
</div>
</div>`;
    });
}

filterByCategory('All')