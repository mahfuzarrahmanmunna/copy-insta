# Instagram Login System

A modern, responsive Instagram-inspired login and user management system built with Next.js 16, React 19, and MariaDB. Features role-based authentication, admin dashboard with user management, and PDF/CSV export capabilities.

## 🚀 Features

- **Instagram-style UI**: Modern, responsive design with gradient text and smooth animations
- **Role-based Authentication**: Admin and user roles with different access levels
- **Admin Dashboard**: Complete user management with data export (CSV/PDF)
- **Auto-registration**: Users are automatically created on first login
- **Secure Database**: MariaDB integration with connection pooling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript Ready**: Built with modern JavaScript standards

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MariaDB** (v10.5 or higher) - [Download here](https://mariadb.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### MariaDB Installation

#### Windows:

1. Download MariaDB from the official website
2. Run the installer
3. Set a root password during installation (remember this!)
4. Start the MariaDB service

#### macOS (using Homebrew):

```bash
brew install mariadb
brew services start mariadb
mysql_secure_installation
```

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install mariadb-server
sudo systemctl start mariadb
sudo mysql_secure_installation
```

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd instagram-login
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MariaDB database:**

   ```sql
   -- Connect to MariaDB as root
   mysql -u root -p

   -- Create the database
   CREATE DATABASE instagram;

   -- Create a user (optional, you can use root)
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON instagram.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;

   -- Create the users table
   USE instagram;
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role ENUM('admin', 'user') DEFAULT 'user',
     email VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Insert a default admin user (optional)
   INSERT INTO users (username, password, role, email) VALUES
   ('admin', 'admin123', 'admin', 'admin@example.com');
   ```

4. **Configure environment variables:**

   Copy the `.env` file and update it with your MariaDB credentials:

   ```bash
   cp .env .env.local
   ```

   Edit `.env.local` with your database details:

   ```env
   # MariaDB Configuration
   DB_HOST=localhost
   DB_USER=your_username        # Use 'root' if you didn't create a new user
   DB_PASSWORD=your_password    # The password you set during MariaDB installation
   DB_NAME=instagram
   DB_PORT=3306

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_super_secret_key_here_change_this_in_production
   ```

   **Security Note:** Never commit `.env.local` to version control!

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a single `users` table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔑 Default Credentials

After setup, you can login with:

- **Admin Account:**
  - Username: `admin`
  - Password: `admin123`

- **Regular User:**
  - Any username/password combination (auto-creates account on first login)

## 🏗️ Project Structure

```
instagram-login/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── login/
│   │   │   └── users/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   └── lib/
│       └── dbConnect.js
├── public/
├── scripts/
│   └── seed.js
├── .env
├── package.json
└── README.md
```

## 🌐 API Endpoints

### Authentication

- `POST /api/login` - User login/authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js routes

### User Management

- `GET /api/users` - Get all users (admin only)

## 📱 Pages

- `/` - Landing page
- `/login` - Login page
- `/admin` - Admin dashboard (user management)
- `/dashboard` - User dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables in Vercel dashboard:**
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_PORT=3306
   NEXTAUTH_SECRET=your_secret_key
   ```
3. **Deploy**

### Other Platforms

For deployment on other platforms, ensure your database is accessible and update the environment variables accordingly.

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- Uses ESLint for code linting
- Tailwind CSS for styling
- Next.js 16 with App Router
- MariaDB for database operations

## 🔒 Security Notes

- Passwords are stored in plain text for demonstration purposes
- In production, implement proper password hashing (bcrypt, argon2)
- Use strong, unique `NEXTAUTH_SECRET`
- Configure database user with minimal required privileges
- Use HTTPS in production

## 📚 Technologies Used

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MariaDB
- **Authentication:** NextAuth.js
- **Icons:** React Icons
- **PDF Generation:** jsPDF, jsPDF-AutoTable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please ensure compliance with Instagram's terms of service and trademark policies when using similar branding.

## 🆘 Troubleshooting

### Database Connection Issues

- Verify MariaDB is running: `sudo systemctl status mariadb`
- Check credentials in `.env.local`
- Ensure database and user exist
- Test connection: `mysql -u your_user -p your_database`

### Build Errors

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

### Port Already in Use

- Kill process on port 3000: `npx kill-port 3000`
- Or use different port: `npm run dev -- -p 3001`

---

Built with ❤️ using Next.js and MariaDB
