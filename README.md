# 🚀 Multi-Tenant NestJS Application with MySQL & TypeORM

A **multi-tenant NestJS application** using **MySQL** and **TypeORM**, where:
- **One master database** stores tenant information.
- **Each tenant has its own database** for data isolation.
- **Dynamic database connections** allow tenant-specific operations.
- **Automatic database migrations** ensure tenants have necessary tables.
- **Middleware handles tenant identification** via headers (`x-tenant-id`).
- **Transactional support** ensures data integrity.

## 📌 Features
✅ **Multi-tenancy support** (one master DB, multiple tenant DBs)  
✅ **Dynamic database creation** per tenant  
✅ **Middleware-based tenant database selection**  
✅ **Automatic migrations for each tenant**  
✅ **Database transactions using QueryRunner** (Coming Soon)  
✅ **RESTful APIs for tenant & user management**  

---

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/rizwansaleem70/nestjs-mutli-tenancy
cd multi-tenant-nestjs
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a .env file in the root directory.
```bash
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password

# Master Database
DB_DATABASE=master_db
```

## 🚀 Creating a tenant
A Prefix `tenant` would be added automatically when you create a new tenant.
```bash
POST http://localhost:3000/tenants
Content-Type: application/json

{
  "name": "tenant1"
}

```

## 🚀 Create Migrations for master database
Master entities would be saved in src/entities folder
```bash
npm run typeorm:generate --name=MigrationName
```


## 🚀 Run Migrations for master database
Master database migrations would be saved in src/database/migrations folder
```bash
npm run typeorm:migrate
```

## 🚀 Create Migrations for tenant database
Master entities would be saved in src/tenant/entities folder
```bash
npm run typeorm:tenant-generate --name=MigrationName --database=tenant_db
```


## 🚀 Run Migrations for tenant database
Tenant database migrations would be saved in src/database/tenant-migrations folder
```bash
npm run typeorm:tenant-migrate --database=tenant_db
```
Same scenarios for revert, show commands. 

