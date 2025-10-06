package database

import (
	"log"
	"restaurant-menu/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitDB initializes the database connection
func InitDB(dbPath string) error {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto migrate the schema
	err = DB.AutoMigrate(&models.Restaurant{}, &models.Category{}, &models.Dish{})
	if err != nil {
		return err
	}

	// Seed initial data if database is empty
	var count int64
	DB.Model(&models.Restaurant{}).Count(&count)
	if count == 0 {
		seedData()
	}

	return nil
}

// seedData seeds the database with initial data
func seedData() {
	log.Println("Seeding database with initial data...")

	// Create restaurant info
	restaurant := models.Restaurant{
		Name:    "The Gourmet Kitchen",
		Address: "123 Main Street, Foodville, FV 12345",
		Phone:   "(555) 123-4567",
	}
	DB.Create(&restaurant)

	// Create categories
	appetizers := models.Category{
		Name:  "Appetizers",
		Order: 1,
	}
	DB.Create(&appetizers)

	mainCourses := models.Category{
		Name:  "Main Courses",
		Order: 2,
	}
	DB.Create(&mainCourses)

	desserts := models.Category{
		Name:  "Desserts",
		Order: 3,
	}
	DB.Create(&desserts)

	beverages := models.Category{
		Name:  "Beverages",
		Order: 4,
	}
	DB.Create(&beverages)

	// Create dishes
	dishes := []models.Dish{
		// Appetizers
		{Name: "Caesar Salad", Description: "Crisp romaine lettuce with parmesan cheese and croutons", Price: 8.99, IsAvailable: true, CategoryID: appetizers.ID},
		{Name: "Bruschetta", Description: "Toasted bread with fresh tomatoes, garlic, and basil", Price: 7.99, IsAvailable: true, CategoryID: appetizers.ID},
		{Name: "Garlic Bread", Description: "Homemade bread with garlic butter and herbs", Price: 5.99, IsAvailable: true, CategoryID: appetizers.ID},

		// Main Courses
		{Name: "Grilled Salmon", Description: "Fresh Atlantic salmon with lemon butter sauce", Price: 24.99, IsAvailable: true, CategoryID: mainCourses.ID},
		{Name: "Ribeye Steak", Description: "12oz premium ribeye cooked to perfection", Price: 32.99, IsAvailable: true, CategoryID: mainCourses.ID},
		{Name: "Chicken Alfredo", Description: "Creamy alfredo pasta with grilled chicken", Price: 18.99, IsAvailable: true, CategoryID: mainCourses.ID},
		{Name: "Vegetarian Lasagna", Description: "Layers of pasta with vegetables and cheese", Price: 16.99, IsAvailable: true, CategoryID: mainCourses.ID},

		// Desserts
		{Name: "Tiramisu", Description: "Classic Italian dessert with espresso and mascarpone", Price: 8.99, IsAvailable: true, CategoryID: desserts.ID},
		{Name: "Chocolate Lava Cake", Description: "Warm chocolate cake with molten center", Price: 9.99, IsAvailable: true, CategoryID: desserts.ID},
		{Name: "Cheesecake", Description: "New York style cheesecake with berry compote", Price: 7.99, IsAvailable: true, CategoryID: desserts.ID},

		// Beverages
		{Name: "Fresh Lemonade", Description: "Homemade lemonade with fresh lemons", Price: 3.99, IsAvailable: true, CategoryID: beverages.ID},
		{Name: "Iced Tea", Description: "Refreshing iced tea with mint", Price: 2.99, IsAvailable: true, CategoryID: beverages.ID},
		{Name: "Coffee", Description: "Freshly brewed coffee", Price: 2.49, IsAvailable: true, CategoryID: beverages.ID},
	}

	for _, dish := range dishes {
		DB.Create(&dish)
	}

	log.Println("Database seeded successfully!")
}
