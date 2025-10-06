# Restaurant Menu Management System

Sistema de gestión de menú de restaurante construido con gRPC, React y TypeScript.

## 📋 Descripción

Aplicación completa para administrar el menú de un restaurante con:
- **Backend gRPC** en Go con base de datos SQLite
- **Frontend React** con TypeScript y Tailwind CSS
- **Proxy Envoy** para traducción gRPC-Web
- **Panel de administración** completo para gestionar categorías y platos
- **Menú público** para visualización de clientes

## 🚀 Inicio Rápido

### Requisitos Previos

- Docker y Docker Compose
- Node.js 20+ (para desarrollo local)
- Go 1.23+ (para desarrollo local)
- Protocol Buffers compiler (para desarrollo local)

### Despliegue con Docker

```bash
# Clonar el repositorio
git clone <repository-url>
cd rest-menu

# Iniciar todos los servicios
make up

# O directamente
docker-compose up --build
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Proxy gRPC-Web: http://localhost:8080
- Backend gRPC: localhost:50051

## 📦 Despliegue en CapRover

Este proyecto está completamente configurado para desplegarse en CapRover. Ver [CAPROVER.md](./CAPROVER.md) para instrucciones detalladas.

### Opción rápida

1. Crear una aplicación en CapRover
2. Comprimir el proyecto:
   ```bash
   tar -czf deploy.tar.gz --exclude=node_modules --exclude=.git .
   ```
3. Subir `deploy.tar.gz` a CapRover
4. CapRover detectará automáticamente el `captain-definition` y desplegará la aplicación

## 🏗️ Estructura del Proyecto

```
rest-menu/
├── backend/           # Servidor gRPC en Go
│   ├── database/      # Inicialización y seeding de BD
│   ├── models/        # Modelos GORM
│   ├── proto/         # Código protobuf generado
│   ├── service/       # Implementaciones gRPC
│   └── Dockerfile
├── frontend/          # Aplicación React + TypeScript
│   ├── src/
│   │   ├── pages/     # PublicMenu y AdminPanel
│   │   ├── proto/     # Código protobuf generado
│   │   └── services/  # Cliente gRPC
│   └── Dockerfile
├── proxy/             # Proxy Envoy para gRPC-Web
│   ├── envoy.yaml
│   └── Dockerfile
├── proto/             # Definiciones Protocol Buffer
├── docker-compose.yml # Orquestación multi-contenedor
├── Dockerfile.caprover # Dockerfile unificado para CapRover
└── captain-definition  # Configuración de CapRover
```

## 🛠️ Desarrollo Local

### Generar archivos protobuf

```bash
make proto
```

### Ejecutar backend

```bash
make run-backend
```

### Ejecutar frontend

```bash
make run-frontend
```

### Construir todo

```bash
make backend
make frontend
```

## 📚 Documentación Adicional

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Detalles técnicos completos de la implementación
- [CAPROVER.md](./CAPROVER.md) - Guía de despliegue en CapRover

## 🔧 Tecnologías Utilizadas

- **Backend**: Go 1.23+, gRPC, GORM, SQLite
- **Frontend**: React 18, TypeScript 5, Tailwind CSS 3
- **Infraestructura**: Docker, Envoy Proxy, Protocol Buffers
- **Despliegue**: CapRover, Docker Compose

## 🌐 API Endpoints (gRPC)

### Servicios Públicos
- `GetFullMenu()` - Obtener menú completo con categorías y platos

### Servicios de Administración

**Restaurante:**
- `GetRestaurantInfo()` - Obtener información del restaurante
- `UpdateRestaurantInfo()` - Actualizar información del restaurante

**Categorías:**
- `CreateCategory()` - Crear nueva categoría
- `ListCategories()` - Listar todas las categorías
- `UpdateCategory()` - Actualizar categoría
- `DeleteCategory()` - Eliminar categoría

**Platos:**
- `CreateDish()` - Crear nuevo plato
- `ListDishesByCategory()` - Listar platos por categoría
- `UpdateDish()` - Actualizar plato
- `DeleteDish()` - Eliminar plato

## 📝 Notas

- La base de datos SQLite se crea automáticamente al iniciar
- Datos de ejemplo incluidos en el primer arranque
- El proyecto usa gRPC-Web en modo "text" para mejor compatibilidad con navegadores
- Configuración de CORS incluida en Envoy para desarrollo

## 📄 Licencia

Ver archivos LICENSE.md y LICENSE-asserts.md para más detalles.
