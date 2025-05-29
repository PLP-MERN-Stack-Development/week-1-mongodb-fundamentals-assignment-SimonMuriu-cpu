//Basic CRUD Operations

// Find all books in a specific genre
db.books.find({ genre: "Fiction" }) // Example query to find all books in the "Fiction" genre. Replace "Fiction" with any genre you want to search for.


// Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } }) // Example query to find all books published after 1950. Change the year as needed.


// Find books by a specific author
db.books.find({ author: "George Orwell" }) // Example query to find all books by George Orwell. Replace "George Orwell" with any author's name you want to search for.


// Update the price of a specific book
db.books.updateOne(
  { title: "1984" }, // Find the book with the title "1984"
  { $set: { price: 12.99 } } // Update its price to 12.99
)
/* Output of the update opertion
acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}*/


//Delete a book by its title
db.books.deleteOne({ title: "1984" }) // Example query to delete the book with the title "1984". Replace "1984" with any book title you want to delete.


// Advanced Querries

//Write a query to find books that are both in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
})

// Use projection to return only the title, author, and price fields in your queries
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)

// Implement sorting to display books by price (both ascending and descending)
db.books.find({}).sort({ price: 1 }) // Ascending order by price
db.books.find({}).sort({ price: -1 }) // Descending order by price


// Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find({}).limit(5) // Get the first 5 books
db.books.find({}).skip(5).limit(5) // Get the next 5 books (6th to 10th)



//Aggreggation Pipeline

// Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre", // Group by genre
      averagePrice: { $avg: "$price" } // Calculate average price for each genre
    }
  },
  {
    $sort: { averagePrice: 1 } // Sort by average price in ascending order
  }
])

// Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author", // Group by author
      bookCount: { $sum: 1 } // Count the number of books for each author
    }
  },
  {
    $sort: { bookCount: -1 } // Sort by book count in descending order
  },
  {
    $limit: 1 // Limit to the top author
  }
])

// Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } }, // Group by decade
      bookCount: { $sum: 1 } // Count the number of books in each decade
    }
  },
  {
    $project: {
      decade: { $multiply: ["$_id", 10] }, // Convert to actual decade (e.g., 1980 for _id = 198)
      bookCount: 1,
      _id: 0 // Exclude the _id field
    }
  },
  {
    $sort: { decade: 1 } // Sort by decade in ascending order
  }
])


// Indexing

// Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 }) 

// Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: -1 }) // Ascending on author, descending on published year

// Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ title: "1984" }).explain("executionStats") // This will show the execution stats for the query, including whether it used an index













