# LetsGo - Task Manager Backend

LetsGo is a robust backend application built with Spring Boot for managing tasks efficiently. It provides secure authentication using JWT, allowing users to register, log in, and manage their personal tasks with features like setting priorities, due dates, and statuses.

## 🚀 Technologies Used

- **Java 21** & **Spring Boot 3.5.x**
- **Spring Security** & **JWT (JSON Web Tokens)** for secure authentication
- **Spring Data JPA** & **Hibernate** for ORM
- **MySQL** as the primary relational database
- **Lombok** to reduce boilerplate code
- **Maven** for dependency management

## ✨ Features

- **User Authentication:**
  - `POST /register`: Register a new user.
  - `POST /login`: Authenticate and receive a JWT token.
- **Task Management (Secured via JWT):**
  - `POST /tasks`: Create a new task.
  - `GET /tasks`: Retrieve all tasks for the logged-in user.
  - `PUT /tasks/{id}`: Update an existing task.
  - `DELETE /tasks/{id}`: Delete a task.

## 📋 Prerequisites

- JDK 21 or higher
- MySQL Server (running on `localhost:3306`)
- Maven

## 🛠️ Setup & Installation

1. **Database Configuration**
   Ensure MySQL is running. The application is configured to use a database named `letsgo` with the username `root` and password `Root@123`.
   Create the database before running:
   ```sql
   CREATE DATABASE letsgo;
   ```
   *(Update the credentials in `src/main/resources/application.properties` if needed.)*

2. **Clone and Build the Project**
   ```sh
   git clone <your-repository-url>
   cd LetsGo
   ./mvnw clean install
   ```

3. **Run the Application**
   ```sh
   ./mvnw spring-boot:run
   ```
   The application will start on `http://localhost:8080`.

## 🛡️ Security

This project implements token-based security. For any `/tasks` endpoint, ensure you pass the JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token_here>
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
