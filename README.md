# Restaurant Menu Management System

A full-stack web application for managing and displaying restaurant menus. Built with Go backend, React frontend, and gRPC/gRPC-Web for communication.

## Features

- **Public Menu Page**: Customer-facing page displaying the complete menu organized by categories
- **Admin Dashboard**: Full CRUD operations for managing restaurant information, categories, and dishes
- **Modern Tech Stack**: Go + gRPC backend, React + TypeScript frontend
- **RESTful API**: gRPC-based API with Web support via Envoy proxy
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

- **Backend**: Go 1.24+, gRPC, GORM, SQLite
- **Frontend**: React 18, TypeScript, gRPC-Web, Tailwind CSS
- **Proxy**: Envoy for gRPC-Web translation
- **Database**: SQLite

## Project Structure

```
/restaurant-menu
├── /backend         # Go server application
│   ├── /database    # Database initialization and seeding
│   ├── /models      # GORM models
│   ├── /proto       # Generated protobuf Go code
│   ├── /service     # gRPC service implementation
│   └── main.go      # Server entry point
├── /frontend        # React client application
│   ├── /src
│   │   ├── /pages   # Public menu and admin panel
│   │   ├── /proto   # Generated protobuf TypeScript code
│   │   └── /services # gRPC client
│   └── Dockerfile
├── /proto           # .proto files for gRPC definitions
└── /proxy           # Envoy proxy configuration
```

## Quick Start

### Prerequisites

- Go 1.24 or later
- Node.js 20 or later
- Protocol Buffers compiler (`protoc`)
- Docker and Docker Compose (for containerized deployment)

### Running with Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/carloslp/rest-menu.git
cd rest-menu
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the application:
   - Public Menu: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Envoy Admin: http://localhost:9901

### Running Locally (Development)

#### 1. Start the Backend

```bash
cd backend
go mod download
go build -o server
./server
```

The backend will start on port `50051`.

#### 2. Start the Envoy Proxy

You can use Docker to run the Envoy proxy:

```bash
cd proxy
docker build -t menu-proxy .
docker run -p 8080:8080 -p 9901:9901 --add-host=host.docker.internal:host-gateway menu-proxy
```

Alternatively, install and run Envoy locally with the provided `envoy.yaml` configuration.

#### 3. Start the Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

The frontend will start on port `3000`.

## API Documentation

The gRPC API is defined in `/proto/menu.proto`. Key services include:

### Public RPCs
- `GetFullMenu`: Retrieves complete menu with restaurant info and all categories with dishes

### Admin RPCs
- **Restaurant**: `GetRestaurantInfo`, `UpdateRestaurantInfo`
- **Categories**: `CreateCategory`, `ListCategories`, `UpdateCategory`, `DeleteCategory`
- **Dishes**: `CreateDish`, `ListDishesByCategory`, `UpdateDish`, `DeleteDish`

## Database

The application uses SQLite with the following models:

- **Restaurant**: Store restaurant information (name, address, phone)
- **Category**: Menu categories with ordering
- **Dish**: Individual menu items linked to categories

The database is automatically initialized with sample data on first run.

## Development

### Regenerating Protobuf Code

After modifying `.proto` files:

**For Go:**
```bash
protoc --go_out=backend --go-grpc_out=backend \
  --go_opt=paths=source_relative \
  --go-grpc_opt=paths=source_relative \
  proto/menu.proto
```

**For TypeScript:**
```bash
protoc -I=proto proto/menu.proto \
  --plugin=protoc-gen-grpc-web=frontend/node_modules/.bin/protoc-gen-grpc-web \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:frontend/src/proto

pbjs -t static-module -w commonjs -o frontend/src/proto/menu_pb.js proto/menu.proto
```

## License

This project is open source and available under the MIT License.
