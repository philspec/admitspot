# Contact Management System

This is a comprehensive RESTful API for a contact management system built with **Next.js** and **Vercel Postgres**. It provides user authentication, advanced contact features, and file handling capabilities.

## ✨ Features

- User authentication (registration, login, JWT-based)
- Contact management (CRUD operations)
- Advanced filtering and sorting for contacts
- Batch processing for contacts
- File upload (CSV/Excel) for bulk contact creation
- File download (CSV) of all contacts
- Timezone handling
- Soft delete functionality

## 💻 Tech Stack

- **Next.js 13+** (App Router)
- **Vercel Postgres**
- **JSON Web Tokens (JWT)** for authentication
- **bcrypt** for password hashing
- **Joi** for data validation
- **csv-parse** and **xlsx** for file parsing
- **moment-timezone** for timezone handling

## ⚙️ Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/contact-management-system.git
    cd contact-management-system
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**  
   Create a `.env.local` file in the root directory and add the following:
    ```plaintext
    POSTGRES_URL=your_postgres_url_here
    JWT_SECRET=your_jwt_secret_here
    ```

4. **Run the development server:**
    ```bash
    npm run dev
    ```
   The server will start on `http://localhost:3000`.

## 🗃️ Database Setup

The project uses **Vercel Postgres**, which handles migrations automatically when deployed to Vercel. For local development, you can run the migrations manually:

1. **Open the Next.js console:**
    ```bash
    npx next console
    ```

2. **Run the following command in the console:**
    ```javascript
    await import('./lib/db/migrations.js').then(m => m.runMigrations())
    ```
   This will create the necessary tables in your **Vercel Postgres** database.

## 📚 API Documentation

### 🔐 Authentication

- **POST /api/auth/register**  
  Register a new user  
  **Body:** `{ name: string, email: string, password: string }`

- **POST /api/auth/login**  
  Login and receive a JWT token  
  **Body:** `{ email: string, password: string }`

### 📇 Contacts

- **GET /api/contacts**  
  Get all contacts  
  **Query parameters:**  
  - `name`: Filter by name (partial match)  
  - `email`: Filter by email (partial match)  
  - `timezone`: Filter by timezone  
  - `sort`: Sort field (default: 'name')  
  - `order`: Sort order ('asc' or 'desc', default: 'asc')  

- **POST /api/contacts**  
  Create a new contact  
  **Body:** `{ name: string, email: string, phone: string, address: string, timezone: string }`

- **GET /api/contacts/[id]**  
  Get a specific contact

- **PUT /api/contacts/[id]**  
  Update a contact  
  **Body:** `{ name: string, email: string, phone: string, address: string, timezone: string }`

- **DELETE /api/contacts/[id]**  
  Delete a contact (soft delete)

- **POST /api/contacts/batch**  
  Batch create/update contacts  
  **Body:** `{ contacts: [{ name: string, email: string, phone: string, address: string, timezone: string }] }`

### 📂 File Handling

- **POST /api/files/upload**  
  Upload CSV/Excel file for bulk contact creation  
  **Body:** FormData with 'file' field

- **GET /api/files/download**  
  Download all contacts as CSV

## 🔒 Security Measures

- JWT authentication for protected routes
- Password hashing using bcrypt
- Rate limiting on sensitive endpoints (login, registration)
- Input validation using Joi
- HTTPS enforcement (when deployed)

## 🚀 Deployment

This project is designed to be deployed on **Vercel**:

1. Push your code to a GitHub repository
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the project

Vercel will automatically handle the build process and database migrations.

## 📊 Database Schema

```mermaid
erDiagram
  USERS {
    int id PK
    string name
    string email
    string password
    datetime created_at
  }
  CONTACTS {
    int id PK
    int user_id FK
    string name
    string email
    string phone
    string address
    string timezone
    datetime created_at
    datetime updated_at
    datetime deleted_at
  }
  USERS ||--o{ CONTACTS : has

## File Structure

/admitspot
|-- /app
|   |-- /api
|   |   |-- /auth
|   |   |-- /contacts
|   |   `-- /files
|   `-- layout.js
|-- /lib
|   |-- /db
|   |-- /auth
|   |-- /validation
|   |-- /email
|   `-- /utils
|-- /middleware.js
|-- /models
|-- /config
|-- next.config.js
|-- package.json
`-- README.md

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📜 License
This project is licensed under the MIT License.