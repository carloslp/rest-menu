.PHONY: proto backend frontend clean

# Generate protobuf files
proto:
	protoc -I=proto proto/menu.proto \
		--go_out=backend --go-grpc_out=backend \
		--go_opt=paths=source_relative \
		--go-grpc_opt=paths=source_relative
	protoc -I=proto proto/menu.proto \
		--plugin=protoc-gen-js=bin/protoc-gen-js \
		--plugin=protoc-gen-grpc-web=frontend/node_modules/.bin/protoc-gen-grpc-web \
		--js_out=import_style=commonjs,binary:frontend/src/proto \
		--grpc-web_out=import_style=typescript,mode=grpcwebtext:frontend/src/proto

# Build backend
backend:
	cd backend && go build -o server

# Build frontend
frontend:
	cd frontend && npm run build

# Run backend
run-backend:
	cd backend && ./server

# Run frontend dev server
run-frontend:
	cd frontend && npm start

# Clean build artifacts
clean:
	rm -f backend/server
	rm -rf frontend/build
	rm -f backend/menu.db

# Start all services with docker-compose
up:
	docker-compose up --build

# Stop all services
down:
	docker-compose down
