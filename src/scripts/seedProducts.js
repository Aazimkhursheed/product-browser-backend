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

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

async function seedProducts() {
  try {
    for (
      let batchStart = 0;
      batchStart < TOTAL_PRODUCTS;
      batchStart += BATCH_SIZE
    ) {
      const values = [];

      for (
        let i = batchStart;
        i < Math.min(batchStart + BATCH_SIZE, TOTAL_PRODUCTS);
        i++
      ) {
        const name = faker.commerce.productName().replace(/'/g, "''");

        const category =
          categories[Math.floor(Math.random() * categories.length)];

        const price = faker.commerce.price();

        const createdAt = faker.date.past().toISOString();
        const updatedAt = faker.date.recent().toISOString();

        values.push(
          `('${name}',
            '${category}',
            ${price},
            '${createdAt}',
            '${updatedAt}')`
        );
      }

      const query = `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ${values.join(",")}
      `;

      await pool.query(query);

      console.log(
        `Inserted ${Math.min(
          batchStart + BATCH_SIZE,
          TOTAL_PRODUCTS
        )} products`
      );
    }

    console.log("Finished inserting 200,000 products!");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedProducts();