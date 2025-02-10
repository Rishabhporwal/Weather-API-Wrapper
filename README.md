# 🌤 NestJS Weather API

A production-ready **NestJS** application that integrates with **OpenWeatherMap**, supports **authentication (JWT)**, **caching (Redis)**, **rate limiting**, **background jobs**, and provides **REST & GraphQL APIs**.

---

## 🚀 Features

✅ **NestJS Modular Architecture**  
✅ **REST & GraphQL Support**  
✅ **Authentication (JWT)**  
✅ **Rate Limiting**  
✅ **Caching (Redis)**  
✅ **Background Jobs (Weather Updates)**  
✅ **Logging & Error Handling**  
✅ **100% Test Coverage with Jest**  

---

## 🛠️ Setup Instructions

### **1️⃣ Install Dependencies**
```sh
npm install
```

### **2️⃣ Set Up Environment Variables**
Create a `.env` file in the project root:
```ini
PORT=3000
OPENWEATHER_API_KEY=your_openweathermap_api_key
JWT_SECRET=your_secret
REDIS_HOST=localhost
REDIS_PORT=6379
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=weatherdb
```

### **3️⃣ Run PostgreSQL & Redis (Docker)**
```sh
docker-compose up -d
```

### **4️⃣ Run Migrations**
```sh
npm run typeorm migration:run
```

### **5️⃣ Start the Server**
```sh
npm run start
```

### **6️⃣ Open API Documentation**
- **REST API (Swagger):** [`http://localhost:3000/docs`](http://localhost:3000/docs)
- **GraphQL Playground:** [`http://localhost:3000/graphql`](http://localhost:3000/graphql)

---

## 📌 API Documentation

### **🔹 REST API**
#### **1️⃣ Get Current Weather**
```http
GET /weather/:city
```
**Response:**
```json
{
  "city": "New York",
  "temperature": 25,
  "humidity": 80,
  "description": "Cloudy"
}
```

#### **2️⃣ Get 5-Day Forecast**
```http
GET /forecast/:city
```

#### **3️⃣ Add Favorite Location**
```http
POST /locations
Content-Type: application/json

{
  "city": "London"
}
```

#### **4️⃣ Get Favorite Locations**
```http
GET /locations
```

#### **5️⃣ Remove Favorite**
```http
DELETE /locations/:id
```

---

### **🔹 GraphQL API**
#### **1️⃣ Get Weather**
```graphql
query {
  weather(city: "Paris") {
    city
    temperature
    description
  }
}
```

#### **2️⃣ Add Favorite**
```graphql
mutation {
  addFavorite(userId: 1, city: "Berlin") {
    id
    city
  }
}
```

#### **3️⃣ Remove Favorite**
```graphql
mutation {
  removeFavorite(id: 2)
}
```

---

## 🔐 Authentication

- User must be authenticated using **JWT**.
- Obtain a token via:
  
  ```http
  POST /auth/login
  ```
  
- Include it in the `Authorization` header:

  ```http
  Authorization: Bearer <TOKEN>
  ```

---

## ⚡ Caching Strategy

- **Weather data** is cached in **Redis** for **30 minutes**.
- **Favorite locations** fetch fresh data on every request.

---

## 🚦 Rate Limiting

- Users can make **60 requests per minute**.
- Exceeding this limit returns:

  ```http
  HTTP 429 Too Many Requests
  ```

---

## 🔄 Background Jobs

- A **background job runs every 30 minutes** to update the **weather data** for all **favorite locations**.
- This ensures the latest data is available without overloading the API.

---

## ✅ Running Tests & Checking Coverage

Run all tests:
```sh
npm run test
```

Check test coverage:
```sh
npm run test:cov
```

---

## 📂 Project Structure

```
src/
│── modules/
│   ├── weather/
│   │   ├── weather.module.ts
│   │   ├── weather.service.ts
│   │   ├── weather.controller.ts
│   │   ├── weather.resolver.ts
│   │   ├── dto/
│   │   ├── entities/
│   ├── favorites/
│   │   ├── favorites.module.ts
│   │   ├── favorites.service.ts
│   │   ├── favorites.controller.ts
│   │   ├── favorites.resolver.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│── config/
│   ├── app.config.ts
│── jobs/
│   ├── weather-update.job.ts
│── common/
│   ├── filters/
│   ├── interceptors/
│   ├── middleware/
│── main.ts
│── app.module.ts
│── .env
│── README.md
```

---

## 📜 License

This project is licensed under the **MIT License**.
