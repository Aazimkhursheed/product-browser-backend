const { faker } = require("@faker-js/faker");
const pool = require("../db");

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Sports",
  "Furniture",
  "Toys",
];

async function insertProducts() {
  try {
    const values = [];

    for (let i = 0; i < 50; i++) {
      const name = faker.commerce
        .productName()
        .replace(/'/g, "''");

      const category =
        categories[
          Math.floor(
            Math.random() * categories.length
          )
        ];

      const price = faker.commerce.price();

      const now =
        new Date().toISOString();

      values.push(
        `(
          '${name}',
          '${category}',
          ${price},
          '${now}',
          '${now}'
        )`
      );
    }

    const query = `
      INSERT INTO products
      (
        name,
        category,
        price,
        created_at,
        updated_at
      )
      VALUES
      ${values.join(",")}
    `;

    await pool.query(query);

    console.log(
      "50 products inserted"
    );

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

insertProducts();