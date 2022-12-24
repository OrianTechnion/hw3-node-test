module.exports.urls404 = {
    GET: ['/api/signup', '/api/login', '/api/product', '/api/permission', '/api/segel'],
    POST: ['/api/permission', '/api/segel','/api/product/123'],
    PUT: ['/api/signup', '/api/login', '/api/product', '/api/segel'],
    DELETE: ['/api/signup', '/api/login', '/api/permission', '/api/segel'],
    PATCH: ['/api/product','/api/product/123','/api/signup','/api/login','/api/permission','/api/segel']
}

// Created by chatGPT :)
module.exports.products = [
    {
        name: "Basic T-Shirt",
        category: "t-shirt",
        description: "A plain, black t-shirt made of soft, comfortable cotton.",
        price: 500,
        stock: 50,
    },
    {
        name: "Hoodie with Logo",
        category: "hoodie",
        description: "A black hoodie with a white, embroidered logo on the chest.",
        price: 800,
        stock: 25,
    },
    {
        name: "Baseball Cap",
        category: "hat",
        description: "A classic baseball cap with an adjustable strap and a embroidered logo on the front.",
        price: 300,
        stock: 40,
    },
    {
        name: "Pearl Necklace",
        category: "necklace",
        description: "A delicate, pearl necklace with a silver chain and clasp.",
        price: 750,
        stock: 15,
    },
    {
        name: "Leather Bracelet",
        category: "bracelet",
        description: "A stylish, leather bracelet with a silver clasp.",
        price: 350,
        stock: 20,
    },
    {
        name: "Running Shoes",
        category: "shoes",
        description: "A pair of lightweight, breathable running shoes with a comfortable fit and good support.",
        price: 1000,
        stock: 30,
    },
    {
        name: "Decorative Pillow",
        category: "pillow",
        description: "A soft, decorative pillow with a colorful pattern and a plush filling.",
        price: 300,
        stock: 40,
    },
    {
        name: "Coffee Mug",
        category: "mug",
        description: "A sturdy, ceramic coffee mug with a comfortable handle and a glossy finish.",
        price: 150,
        stock: 50,
    },
    {
        name: "Mystery Novel",
        category: "book",
        description: "A thrilling, mystery novel with a complex plot and engaging characters.",
        price: 499,
        stock: 35,
    },
    {
        name: "1000 Piece Puzzle",
        category: "puzzle",
        description: "A challenging, 1000 piece jigsaw puzzle with a colorful, detailed image.",
        price: 300,
        stock: 20,
    },
    {
        name: "Black Jack",
        category: "cards",
        description: "Best betting game on earth",
        price: 900,
        stock: 48,
    }
];

module.exports.productsWithImage = [
    {
        name: "Basic T-Shirt",
        category: "t-shirt",
        description: "A plain, black t-shirt made of soft, comfortable cotton.",
        price: 500,
        stock: 50,
        image: "https://www.example.com/tshirt.jpg"
    },
    {
        name: "Hoodie with Logo",
        category: "hoodie",
        description: "A black hoodie with a white, embroidered logo on the chest.",
        price: 800,
        stock: 25,
        image: "https://www.example.com/hoodie.jpg"
    },
    {
        name: "Baseball Cap",
        category: "hat",
        description: "A classic baseball cap with an adjustable strap and a embroidered logo on the front.",
        price: 300,
        stock: 40,
        image: "https://www.example.com/hat.jpg"
    },
    {
        name: "Pearl Necklace",
        category: "necklace",
        description: "A delicate, pearl necklace with a silver chain and clasp.",
        price: 750,
        stock: 15,
        image: "https://www.example.com/necklace.jpg"
    },
    {
        name: "Leather Bracelet",
        category: "bracelet",
        description: "A stylish, leather bracelet with a silver clasp.",
        price: 350,
        stock: 20,
        image: "https://www.example.com/bracelet.jpg"
    },
    {
        name: "Running Shoes",
        category: "shoes",
        description: "A pair of lightweight, breathable running shoes with a comfortable fit and good support.",
        price: 1000,
        stock: 30,
        image: "https://www.example.com/shoes.jpg"
    },
    {
        name: "Decorative Pillow",
        category: "pillow",
        description: "A soft, decorative pillow with a colorful pattern and a plush filling.",
        price: 300,
        stock: 40,
        image: "https://www.example.com/pillow.jpg"
    },
    {
        name: "Coffee Mug",
        category: "mug",
        description: "A sturdy, ceramic coffee mug with a comfortable handle and a glossy finish.",
        price: 150,
        stock: 50,
        image: "https://www.example.com/mug.jpg"
    },
    {
        name: "Mystery Novel",
        category: "book",
        description: "A thrilling, mystery novel with a complex plot and engaging characters.",
        price: 499,
        stock: 35,
        image: "https://www.example.com/book.jpg"
    },
    {
        name: "1000 Piece Puzzle",
        category: "puzzle",
        description: "A challenging, 1000 piece jigsaw puzzle with a colorful, detailed image.",
        price: 300,
        stock: 20,
        image: "https://www.example.com/puzzle.jpg"
    },
    {
        name: "Black Jack",
        category: "cards",
        description: "Best betting game on earth",
        price: 900,
        stock: 48,
        image: "https://www.example.com/blackjack.jpg"
    }
];

module.exports.categories =  ['t-shirt', 'hoodie', 'hat','necklace', 'bracelet','shoes','pillow','mug','book','puzzle','cards'];