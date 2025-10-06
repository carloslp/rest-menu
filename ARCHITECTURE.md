# CapRover Deployment Architecture

## Option 1: Unified Deployment (Recommended for Simple Setups)

```
┌─────────────────────────────────────────────────┐
│         CapRover App: rest-menu                  │
│  Port 80 (exposed to internet via CapRover)      │
└─────────────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Supervisord (PID 1)   │
         └────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │           │           │
          ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │ Nginx   │ │ Envoy   │ │ Backend │
    │ :80     │ │ :8080   │ │ :50051  │
    └─────────┘ └─────────┘ └─────────┘
          │           │           │
          │           └───────────┘
          │          gRPC-Web ↔ gRPC
          ▼
    Static Files
    (React App)

Flow:
1. User → CapRover (HTTPS) → Nginx (HTTP :80)
2. Static files served directly by Nginx
3. API calls → Nginx → Envoy (:8080) → Backend (:50051)
4. Envoy translates gRPC-Web ↔ gRPC
```

## Option 2: Multi-Service Deployment (Recommended for Production)

```
┌──────────────────────────────────────────────────┐
│              CapRover Network                     │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  App: rest-menu-frontend (exposed)       │    │
│  │  Port 80 → Internet                       │    │
│  │  ┌──────────────┐                        │    │
│  │  │  Nginx       │                        │    │
│  │  │  Static Files│                        │    │
│  │  └──────────────┘                        │    │
│  └──────────────┬──────────────────────────┘    │
│                 │ API Calls                      │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │  App: rest-menu-proxy (internal)         │    │
│  │  Port 8080                                │    │
│  │  ┌──────────────┐                        │    │
│  │  │  Envoy Proxy │                        │    │
│  │  └──────────────┘                        │    │
│  └──────────────┬──────────────────────────┘    │
│                 │ gRPC                          │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │  App: rest-menu-backend (internal)       │    │
│  │  Port 50051                               │    │
│  │  ┌──────────────┐  ┌─────────────┐      │    │
│  │  │  Go gRPC     │──│  SQLite DB  │      │    │
│  │  │  Server      │  │  (Volume)   │      │    │
│  │  └──────────────┘  └─────────────┘      │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
└──────────────────────────────────────────────────┘

Benefits:
- Independent scaling of services
- Better resource utilization
- Easier debugging and monitoring
- Separate health checks per service
- Database can be in separate persistent volume
```

## Files Structure

```
rest-menu/
├── captain-definition              # Main config (unified deployment)
├── Dockerfile.caprover             # Unified Dockerfile
├── CAPROVER.md                     # Deployment guide
├── nginx.caprover.conf             # Nginx config for unified
├── supervisord.caprover.conf       # Process manager config
│
├── backend/
│   ├── captain-definition          # Backend-only deployment
│   └── Dockerfile                  # Backend Dockerfile
│
├── frontend/
│   ├── captain-definition          # Frontend-only deployment
│   └── Dockerfile                  # Frontend Dockerfile
│
└── proxy/
    ├── captain-definition          # Proxy-only deployment
    ├── Dockerfile                  # Proxy Dockerfile
    ├── envoy.yaml                  # Original (multi-service)
    └── envoy.caprover.yaml         # Modified for localhost
```

## Deployment Commands

### Unified Deployment
```bash
# From project root
tar -czf deploy.tar.gz --exclude=node_modules --exclude=.git .
# Upload to CapRover app
```

### Multi-Service Deployment
```bash
# Backend
cd backend && tar -czf deploy.tar.gz * && cd ..

# Proxy
cd proxy && tar -czf deploy.tar.gz * && cd ..

# Frontend  
cd frontend && tar -czf deploy.tar.gz * && cd ..
```

## Environment Variables (Optional)

For the unified deployment, you can configure:
- `BACKEND_PORT`: Backend gRPC port (default: 50051)
- `PROXY_PORT`: Envoy proxy port (default: 8080)
- `FRONTEND_PORT`: Nginx port (default: 80)

For multi-service:
- Configure service URLs in CapRover app settings
- Update envoy.yaml with correct backend service name

## Health Checks

The unified Dockerfile includes a health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

For multi-service, configure individual health checks in CapRover.
