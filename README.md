# Pinterest Clone

A full-stack Pinterest-inspired web application built using React, TypeScript, Node.js, Express, and PostgreSQL.

Users can register and log in, create and manage their own pins, explore content, search by title or description, filter by category, and save pins to their personal collections.

## Features

### Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes.
- Individual user accounts.

### Pin Management
- Create new pins with a title, image URL, description, and category.
- Edit existing pins.
- Delete pins.
- View individual pin details.
- Pins are associated with their creators.

### Search and Discovery
- Search pins by title and description.
- Filter pins by category:
  - Travel
  - Fitness
  - Coding
  - Food

### Saved Collections
- Save and unsave pins.
- View saved pins on a dedicated page.
- Saved collections are user-specific.
- Duplicate saves are prevented by a database constraint.

### Responsive Design
- Responsive layouts for desktop, tablet, and mobile screens.
- Pinterest-inspired masonry-style pin layout.

## Tech Stack

**Frontend**
- React
- TypeScript
- React Router
- CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Helmet
- Express Rate Limit

**Database**
- PostgreSQL
- pg (node-postgres)

**Development Tools**
- Git
- GitHub
- Postman
- pgAdmin

## Project Structure

```text
Pinterest-Clone/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AuthContext.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Pin.tsx
│   │   ├── PinContext.tsx
│   │   ├── PinDetail.tsx
│   │   ├── PinForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Register.tsx
│   │   └── Saved.tsx
│   │
│   ├── App.tsx
│   ├── index.tsx
│   └── styles.css
│
├── server/
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── test-db.js
│
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- PostgreSQL
- pgAdmin (optional, for database management)

### 1. Clone the Repository

```bash
git clone https://github.com/NanakRPatvardhan/Pinterest-Clone.git
```

Navigate into the project:

```bash
cd Pinterest-Clone
```

### 2. Set Up the Database

Open PostgreSQL or pgAdmin and create a database named:

```sql
CREATE DATABASE pinterest_clone;
```

Connect to the new database and execute the following SQL:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pins (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id),
    CONSTRAINT pins_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT pins_other_fields_not_empty CHECK (
        LENGTH(TRIM(image)) > 0 AND
        LENGTH(TRIM(description)) > 0 AND
        LENGTH(TRIM(category)) > 0
    )
);

CREATE TABLE saved_pins (
    id SERIAL PRIMARY KEY,
    pin_id INTEGER NOT NULL REFERENCES pins(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    CONSTRAINT saved_pins_user_pin_unique UNIQUE (user_id, pin_id)
);
```

### 3. Configure Environment Variables

Inside the `server` directory, create a file named `.env`.

Add your PostgreSQL credentials and JWT secret:

```env
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=pinterest_clone
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=your_secure_random_secret
```

Replace the placeholder values with your local configuration.

**Important:** Never upload your `.env` file or expose your database credentials or JWT secret.

### 4. Install Dependencies

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

### 5. Start the Backend

From the `server` directory, run:

```bash
node index.js
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Start the Frontend

Open a second terminal, navigate to the project root, and run:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

You can now register an account and start using the application.

## Database Design

The application uses three PostgreSQL tables:

| Table | Purpose |
|---|---|
| `users` | Stores registered user accounts and password hashes. |
| `pins` | Stores pins created by users. |
| `saved_pins` | Stores user-specific saved pin relationships. |

**Relationships:**

- Each pin belongs to a user.
- Each saved pin references a user and a pin.
- A user cannot save the same pin more than once.

## Future Improvements

- Image uploading and cloud storage.
- Public discovery feed across users.
- Additional social features.
- Deployment to a production environment.

## Author

**Nanak Patvardhan**

GitHub: [NanakRPatvardhan](https://github.com/NanakRPatvardhan)