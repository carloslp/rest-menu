package models

import (
	"gorm.io/gorm"
)

// Restaurant represents the restaurant information
type Restaurant struct {
	gorm.Model
	Name    string `gorm:"type:varchar(255);not null"`
	Address string `gorm:"type:varchar(255)"`
	Phone   string `gorm:"type:varchar(50)"`
}

// Category represents a menu category
type Category struct {
	gorm.Model
	Name  string `gorm:"type:varchar(100);not null"`
	Order int    `gorm:"not null"`
	Dishes []Dish `gorm:"foreignKey:CategoryID"`
}

// Dish represents a dish/item in the menu
type Dish struct {
	gorm.Model
	Name        string  `gorm:"type:varchar(255);not null"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"type:decimal(10,2);not null"`
	IsAvailable bool    `gorm:"default:true"`
	CategoryID  uint    `gorm:"not null"`
	Category    *Category `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
