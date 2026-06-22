const pool = require("../db");

const getProducts = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);

    if (!limit || limit <= 0) {
    limit = 20;
    }

    if (limit > 100) {
    limit = 100;
    }

    const { category, cursor } = req.query;
    let cursorUpdatedAt = null;
        let cursorId = null;

        if (cursor) {
        const lastUnderscoreIndex = cursor.lastIndexOf("_");

        cursorUpdatedAt = cursor.substring(0, lastUnderscoreIndex);
        cursorId = parseInt(
            cursor.substring(lastUnderscoreIndex + 1)
        );
        }

        if (cursor && (!cursorUpdatedAt || isNaN(cursorId))) {
  return res.status(400).json({
    success: false,
    message: "Invalid cursor",
  });
}


    let query;
    let values;

    // If category filter exists
if (!category && !cursor) {
  query = `
    SELECT
      id,
      name,
      category,
      price,
      created_at,
      updated_at
    FROM products
    ORDER BY updated_at DESC, id DESC
    LIMIT $1
  `;

  values = [limit];
}

else if (category && !cursor) {
  query = `
    SELECT
      id,
      name,
      category,
      price,
      created_at,
      updated_at
    FROM products
    WHERE category = $1
    ORDER BY updated_at DESC, id DESC
    LIMIT $2
  `;

  values = [category, limit];
}

else if (!category && cursor) {
  query = `
    SELECT
      id,
      name,
      category,
      price,
      created_at,
      updated_at
    FROM products
    WHERE
      (updated_at, id) < ($1, $2)
    ORDER BY updated_at DESC, id DESC
    LIMIT $3
  `;

  values = [
    cursorUpdatedAt,
    cursorId,
    limit,
  ];
}

else {
  query = `
    SELECT
      id,
      name,
      category,
      price,
      created_at,
      updated_at
    FROM products
    WHERE
      category = $1
      AND
      (updated_at, id) < ($2, $3)
    ORDER BY updated_at DESC, id DESC
    LIMIT $4
  `;

  values = [
    category,
    cursorUpdatedAt,
    cursorId,
    limit,
  ];
}

    const result = await pool.query(query, values);

    let nextCursor = null;

if (result.rows.length > 0) {
  const lastProduct =
    result.rows[result.rows.length - 1];

  nextCursor =
    `${lastProduct.updated_at.toISOString()}_${lastProduct.id}`;
}

res.status(200).json({
  success: true,
  count: result.rows.length,
  nextCursor,
  products: result.rows,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



module.exports = {
  getProducts,
};