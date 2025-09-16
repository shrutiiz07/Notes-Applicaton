📒 Notes SaaS

A multi-tenant SaaS Notes Application built with Next.js, MongoDB, and JWT authentication.
Users can log in, create, edit, and delete notes. Tenants can be upgraded from Free → Pro plan with restrictions on note creation.

🚀Features

🔑 Authentication with JWT (JSON Web Token)

📝 Notes CRUD (Create, Read, Update, Delete)

⚡ Real-time UI updates without refresh

👥 Multi-tenant support (per organization/user group)

🎛️ Role-based access (Admin vs Member)

💳 Upgrade to Pro plan when free plan limits are hit

🖥️ Responsive UI with clean design

⚙️ Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/notes-saas.git
cd notes-saas

2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Configure environment variables

Create a .env.local file in the root:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/notes-saas
JWT_SECRET=your_jwt_secret

4️⃣ Run development server
npm run dev


App runs at http://localhost:3000


🛠️ Tech Stack

Frontend: Next.js, React

Backend: Next.js API routes

Database: MongoDB + Mongoose

Auth: JWT

Deployment: Vercel / Render / Railway
