# Nova Sites API

Backend API cho Nova Sites - License Key Management System

## 🚀 Quick Start

### Development (Local)

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your config

# Run migrations
npm run db:migrate

# Seed initial data (Website configs, etc.)
npm run db:seed:all

# Start dev server
npm run dev
```

### Production (Docker)

Xem chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# Copy and edit environment
cp env.docker.example .env
nano .env

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## 📁 Cấu Trúc Project

```
api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   ├── migrations/       # DB migrations
│   └── lib/              # Utilities
├── docker/               # Docker configs
├── nginx/                # Nginx configs
│   └── conf.d/          
│       └── default.conf  # Main nginx config
├── certbot/              # SSL certificates
│   ├── conf/            # Let's Encrypt configs
│   └── webroot/         # ACME challenge
├── scripts/              # Utility scripts
│   └── init-ssl.sh      # SSL setup script
├── Dockerfile
├── docker-compose.yml
└── DEPLOYMENT.md        # Deploy guide

```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### License Keys
- `GET /api/v1/license-keys` - Get all keys (Admin)
- `GET /api/v1/license-keys/stats` - Get statistics (Admin)
- `GET /api/v1/license-keys/my-keys` - Get user's keys
- `POST /api/v1/license-keys/purchase` - Purchase a key
- `POST /api/v1/license-keys/sync` - Sync from external API (Admin)
- `DELETE /api/v1/license-keys/:id` - Delete key (Admin)

### API Management (Admin Only)
- `POST /api/v1/api-management/license-keys/generate/batch` - Generate keys

## 🗄️ Database Schema

### Users
- Basic authentication & profile
- Roles: user, admin, super_admin

### License Keys
- External ID (from MongoDB API)
- Key string
- Duration (1d, 7d, 30d, 90d, 180d, 365d)
- Status (active, used)
- Purchase info

## 🔐 Environment Variables

Xem file `env.docker.example` để biết tất cả biến môi trường cần thiết.

**Critical:**
- `JWT_ACCESS_SECRET` - JWT signing secret
- `DB_PASSWORD` - Database password
- `ADMIN_API_TOKEN` - External API token
- `EXTERNAL_API_URL` - External license API

## 📝 Scripts

```bash
# Development
npm run dev           # Start dev server with hot reload
npm run build         # Build TypeScript
npm run start         # Start production server

# Database
npm run db:migrate         # Run migrations
npm run db:migrate:undo    # Rollback last migration
npm run db:seed:all        # Seed all data
npm run db:migrate:status  # Check migration status

# Code Quality
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npm run type-check    # TypeScript check
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service]

# Rebuild
docker-compose build --no-cache

# Execute command in container
docker-compose exec api npm run db:migrate
docker-compose exec api npm run db:seed:all
```

## 📦 Deployment

**Trước khi deploy:**
1. ✅ Update domain trong `nginx/conf.d/default.conf`
2. ✅ Update `.env` với thông tin production
3. ✅ Đảm bảo DNS A record đã trỏ về VPS
4. ✅ Ports 80, 443 đã mở trên firewall

**Xem chi tiết:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔒 Security

- ✅ Rate limiting enabled
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ SQL injection protection (Sequelize ORM)
- ✅ XSS protection
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Logs
```bash
# Application logs
tail -f logs/app.log

# Docker logs
docker-compose logs -f api
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using port 8000
lsof -i :8000
# or
netstat -ano | findstr :8000

# Kill process
kill -9 <PID>
```

### Database connection error
```bash
# Check MySQL is running
docker-compose ps mysql

# Check credentials in .env
cat .env | grep DB_

# Reset database
docker-compose down -v
docker-compose up -d
```

### Migration failed
```bash
# Rollback
npm run db:migrate:undo

# Check migration status
npm run db:migrate:status

# Re-run
npm run db:migrate
```

## 📞 Support

For issues, please create an issue on GitHub or contact the development team.

## 📄 License

Proprietary - All rights reserved
