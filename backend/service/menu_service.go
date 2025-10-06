package service

import (
	"context"
	"log"
	"restaurant-menu/database"
	"restaurant-menu/models"
	pb "restaurant-menu/proto"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type MenuServer struct {
	pb.UnimplementedMenuServiceServer
}

// GetFullMenu returns the complete menu with restaurant info and all categories with dishes
func (s *MenuServer) GetFullMenu(ctx context.Context, req *pb.Empty) (*pb.FullMenuResponse, error) {
	log.Println("GetFullMenu called")

	// Get restaurant info
	var restaurant models.Restaurant
	if err := database.DB.First(&restaurant).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to fetch restaurant info: %v", err)
	}

	restaurantInfo := &pb.RestaurantInfo{
		Name:    restaurant.Name,
		Address: restaurant.Address,
		Phone:   restaurant.Phone,
	}

	// Get categories with dishes
	var categories []models.Category
	if err := database.DB.Order("`order` asc").Preload("Dishes").Find(&categories).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to fetch categories: %v", err)
	}

	var categoriesWithDishes []*pb.CategoryWithDishes
	for _, cat := range categories {
		pbCategory := &pb.Category{
			Id:    int32(cat.ID),
			Name:  cat.Name,
			Order: int32(cat.Order),
		}

		var pbDishes []*pb.Dish
		for _, dish := range cat.Dishes {
			if dish.IsAvailable {
				pbDishes = append(pbDishes, &pb.Dish{
					Id:          int32(dish.ID),
					Name:        dish.Name,
					Description: dish.Description,
					Price:       dish.Price,
					IsAvailable: dish.IsAvailable,
					CategoryId:  int32(dish.CategoryID),
				})
			}
		}

		categoriesWithDishes = append(categoriesWithDishes, &pb.CategoryWithDishes{
			CategoryInfo: pbCategory,
			Dishes:       pbDishes,
		})
	}

	return &pb.FullMenuResponse{
		RestaurantInfo: restaurantInfo,
		Categories:     categoriesWithDishes,
	}, nil
}

// GetRestaurantInfo returns the restaurant information
func (s *MenuServer) GetRestaurantInfo(ctx context.Context, req *pb.Empty) (*pb.RestaurantInfo, error) {
	log.Println("GetRestaurantInfo called")

	var restaurant models.Restaurant
	if err := database.DB.First(&restaurant).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to fetch restaurant info: %v", err)
	}

	return &pb.RestaurantInfo{
		Name:    restaurant.Name,
		Address: restaurant.Address,
		Phone:   restaurant.Phone,
	}, nil
}

// UpdateRestaurantInfo updates the restaurant information
func (s *MenuServer) UpdateRestaurantInfo(ctx context.Context, req *pb.RestaurantInfo) (*pb.RestaurantInfo, error) {
	log.Printf("UpdateRestaurantInfo called with: %+v\n", req)

	var restaurant models.Restaurant
	if err := database.DB.First(&restaurant).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to fetch restaurant info: %v", err)
	}

	restaurant.Name = req.Name
	restaurant.Address = req.Address
	restaurant.Phone = req.Phone

	if err := database.DB.Save(&restaurant).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to update restaurant info: %v", err)
	}

	return &pb.RestaurantInfo{
		Name:    restaurant.Name,
		Address: restaurant.Address,
		Phone:   restaurant.Phone,
	}, nil
}

// CreateCategory creates a new category
func (s *MenuServer) CreateCategory(ctx context.Context, req *pb.Category) (*pb.Category, error) {
	log.Printf("CreateCategory called with: %+v\n", req)

	category := models.Category{
		Name:  req.Name,
		Order: int(req.Order),
	}

	if err := database.DB.Create(&category).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create category: %v", err)
	}

	return &pb.Category{
		Id:    int32(category.ID),
		Name:  category.Name,
		Order: int32(category.Order),
	}, nil
}

// ListCategories returns all categories
func (s *MenuServer) ListCategories(ctx context.Context, req *pb.Empty) (*pb.ListCategoriesResponse, error) {
	log.Println("ListCategories called")

	var categories []models.Category
	if err := database.DB.Order("`order` asc").Find(&categories).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to fetch categories: %v", err)
	}

	var pbCategories []*pb.Category
	for _, cat := range categories {
		pbCategories = append(pbCategories, &pb.Category{
			Id:    int32(cat.ID),
			Name:  cat.Name,
			Order: int32(cat.Order),
		})
	}

	return &pb.ListCategoriesResponse{
		Categories: pbCategories,
	}, nil
}

// UpdateCategory updates an existing category
func (s *MenuServer) UpdateCategory(ctx context.Context, req *pb.Category) (*pb.Category, error) {
	log.Printf("UpdateCategory called with: %+v\n", req)

	var category models.Category
	if err := database.DB.First(&category, req.Id).Error; err != nil {
		return nil, status.Errorf(codes.NotFound, "category not found: %v", err)
	}

	category.Name = req.Name
	category.Order = int(req.Order)

	if err := database.DB.Save(&category).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to update category: %v", err)
	}

	return &pb.Category{
		Id:    int32(category.ID),
		Name:  category.Name,
		Order: int32(category.Order),
	}, nil
}

// DeleteCategory deletes a category
func (s *MenuServer) DeleteCategory(ctx context.Context, req *pb.CategoryID) (*pb.Empty, error) {
	log.Printf("DeleteCategory called with ID: %d\n", req.Id)

	if err := database.DB.Delete(&models.Category{}, req.Id).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete category: %v", err)
	}

	return &pb.Empty{}, nil
}

// CreateDish creates a new dish
func (s *MenuServer) CreateDish(ctx context.Context, req *pb.Dish) (*pb.Dish, error) {
	log.Printf("CreateDish called with: %+v\n", req)

	dish := models.Dish{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		IsAvailable: req.IsAvailable,
		CategoryID:  uint(req.CategoryId),
	}

	if err := database.DB.Create(&dish).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create dish: %v", err)
	}

	return &pb.Dish{
		Id:          int32(dish.ID),
		Name:        dish.Name,
		Description: dish.Description,
		Price:       dish.Price,
		IsAvailable: dish.IsAvailable,
		CategoryId:  int32(dish.CategoryID),
	}, nil
}

// ListDishesByCategory returns all dishes in a category
func (s *MenuServer) ListDishesByCategory(ctx context.Context, req *pb.CategoryID) (*pb.ListDishesResponse, error) {
	log.Printf("ListDishesByCategory called with category ID: %d\n", req.Id)

	var dishes []models.Dish
	if err := database.DB.Where("category_id = ?", req.Id).Find(&dishes).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to fetch dishes: %v", err)
	}

	var pbDishes []*pb.Dish
	for _, dish := range dishes {
		pbDishes = append(pbDishes, &pb.Dish{
			Id:          int32(dish.ID),
			Name:        dish.Name,
			Description: dish.Description,
			Price:       dish.Price,
			IsAvailable: dish.IsAvailable,
			CategoryId:  int32(dish.CategoryID),
		})
	}

	return &pb.ListDishesResponse{
		Dishes: pbDishes,
	}, nil
}

// UpdateDish updates an existing dish
func (s *MenuServer) UpdateDish(ctx context.Context, req *pb.Dish) (*pb.Dish, error) {
	log.Printf("UpdateDish called with: %+v\n", req)

	var dish models.Dish
	if err := database.DB.First(&dish, req.Id).Error; err != nil {
		return nil, status.Errorf(codes.NotFound, "dish not found: %v", err)
	}

	dish.Name = req.Name
	dish.Description = req.Description
	dish.Price = req.Price
	dish.IsAvailable = req.IsAvailable
	dish.CategoryID = uint(req.CategoryId)

	if err := database.DB.Save(&dish).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to update dish: %v", err)
	}

	return &pb.Dish{
		Id:          int32(dish.ID),
		Name:        dish.Name,
		Description: dish.Description,
		Price:       dish.Price,
		IsAvailable: dish.IsAvailable,
		CategoryId:  int32(dish.CategoryID),
	}, nil
}

// DeleteDish deletes a dish
func (s *MenuServer) DeleteDish(ctx context.Context, req *pb.DishID) (*pb.Empty, error) {
	log.Printf("DeleteDish called with ID: %d\n", req.Id)

	if err := database.DB.Delete(&models.Dish{}, req.Id).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete dish: %v", err)
	}

	return &pb.Empty{}, nil
}
