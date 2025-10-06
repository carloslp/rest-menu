package main

import (
	"log"
	"net"
	"restaurant-menu/database"
	pb "restaurant-menu/proto"
	"restaurant-menu/service"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

const (
	port   = ":50051"
	dbPath = "menu.db"
)

func main() {
	// Initialize database
	if err := database.InitDB(dbPath); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	log.Println("Database initialized successfully")

	// Create gRPC server
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterMenuServiceServer(grpcServer, &service.MenuServer{})

	// Register reflection service for debugging
	reflection.Register(grpcServer)

	log.Printf("Server listening on %s", port)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
