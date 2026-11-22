import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("foodora.db");
    await db
      .execAsync(
        ` 
      PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS carts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            restaurantId TEXT NOT NULL,
            foodId TEXT NOT NULL,
            name TEXT NOT NULL,
            imageUrl TEXT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),   
            category TEXT NOT NULL,
            UNIQUE (restaurantId, foodId)
        );

        CREATE TABLE IF NOT EXISTS orders(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            restaurantName TEXT NOT NULL,
            restaurantImage TEXT,
            status TEXT NOT NULL DEFAULT "pending",
            totalPrice REAL NOT NULL DEFAULT 0,   
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orderItem(
            id INTEGER PRIMARY KEY AUTOINCREMENT,            
            orderId INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            price INTEGER NOT NULL
              CHECK(price > 0),
            imageUrl TEXT,
            quantity INTEGER NOT NULL DEFAULT 1
              CHECK(quantity > 0 ),
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
        );
        `,
      )
      .catch((err) => {
        db = null;
        throw err;
      });
  }
  return db;
};

export const getAllRestaurant = async (): Promise<any[]> => {
  if (!db) {
    await initDatabase();
  }

  const restaurants = await db!.getAllAsync("SELECT * FROM restaurants");
  return restaurants;
};

export const getAllFoods = async (): Promise<any[]> => {
  if (!db) {
    await initDatabase();
  }

  const foods = await db!.getAllAsync("SELECT * FROM foods");
  return foods;
};

export const getAllOrders = async (): Promise<any[]> => {
  if (!db) {
    await initDatabase();
  }

  const orders = await db!.getAllAsync("SELECT * FROM orders");
  return orders;
};

export const getAllCarts = async (): Promise<any[]> => {
  if (!db) {
    await initDatabase();
  }
  return await db!.getAllAsync("SELECT * FROM carts");
};

export const getAllOrderItem = async (): Promise<any[]> => {
  if (!db) {
    await initDatabase();
  }

  const orderItem = await db!.getAllAsync("SELECT * FROM orderItem");
  return orderItem;
};

export const insertRestaurant = async (
  name: string,
  description: string,
  imageUrl: string,
  isFavorite: boolean,
): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync(
    "INSERT INTO restaurants (name,description,imageUrl,isFavorite) VALUES(?,?,?,?)",
    [name, description, imageUrl, isFavorite],
  );
};

export const insertCart = async (items: any) => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync(
    `INSERT INTO carts (userId,restaurantId,foodId,name,price,quantity,imageUrl,category) 
     VALUES(?,?,?,?,?,?,?) 
     ON CONFLICT (userId,foodId)
     DO UPDATE SET quantity = excluded.quantity
    `,
    [
      items.userId,
      items.restaurantId,
      items.foodId,
      items.name,
      items.price,
      items.quantity,
      items.imageUrl,
      items.category,
    ],
  );
};

export const updateQunatity = async (userId: string, foodId: string) => {
  if (!db) {
    await initDatabase();
  }

  return await db?.runAsync(
    `
    UPDATE carts 
    SET quantity = quantity + 1
    WHERE userId = ? AND foodId = ?
    `,
    [userId, foodId],
  );
};

export const decreaseQuantity = async (
  foodId: string,
  currentQuantity: number,
) => {
  if (!db) {
    await initDatabase();
  }

  if (currentQuantity <= 1) {
    await deleteFromCartByFoodId(foodId);
  } else {
    await db?.runAsync(
      "UPDATE carts SET quantity = quantity - 1 WHERE foodId == ? ",
      [foodId],
    );
  }
};

export const insertFood = async (
  restaurantId: number,
  name: string,
  description: string,
  imageUrl: string,
  price: number,
  isFavorite: boolean,
): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync(
    "INSERT INTO foods (restaurantId,name,description,price,imageUrl,isFavorite) VALUES(?,?,?,?,?,?)",
    [restaurantId, name, description, price, imageUrl, isFavorite],
  );
};

export const insertOrder = async (
  foodId: number,
  totalPice: string,
  status: string,
  createAt: string,
): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync(
    "INSERT INTO orders (foodId,totalPice,status,createAt) VALUES(?,?,?,?)",
    [foodId, totalPice, status, createAt],
  );
};

export const insertOrderItem = async (
  foodId: number,
  orderId: number,
  price: number,
): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync(
    "INSERT INTO orderItem (foodId,orderId,quantity) VALUES(?,?,?)",
    [foodId, orderId, price],
  );
};

export const deleteFromCartByFoodId = async (foodId: string) => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync("DELETE FROM carts WHERE foodId == ?", [foodId]);
};

export const clearCartSQLite = async () => {
  if (!db) {
    await initDatabase();
  }

  await db?.runAsync("DELETE FROM carts");
};
