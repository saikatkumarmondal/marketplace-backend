# Marketplace Project Workflow Backend

This is a **Node.js + Express.js + MongoDB backend** for a role-based project marketplace workflow system.  
It allows **Buyers** to create projects, **Solvers** to request and work on projects, and **Admins** to manage users and roles.

All APIs follow **REST principles** with proper role-based access control (RBAC) and file handling for submissions.

---

## **Tech Stack**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer for ZIP file uploads
- dotenv for environment variables

---

## **Folder Structure**

marketplace-backend/
├── src/
│ ├── app.js
│ ├── server.js
│ ├── routes.js
│ ├── middlewares/
│ │ ├── auth.js
│ │ └── role.js
│ ├── modules/
│ │ ├── auth/
│ │ │ ├── auth.controller.js
│ │ │ ├── auth.routes.js
│ │ │ └── auth.model.js
│ │ ├── users/
│ │ │ ├── user.controller.js
│ │ │ ├── user.routes.js
│ │ │ └── user.model.js
│ │ ├── projects/
│ │ │ ├── project.controller.js
│ │ │ ├── project.routes.js
│ │ │ └── project.model.js
│ │ ├── requests/
│ │ │ ├── request.controller.js
│ │ │ ├── request.routes.js
│ │ │ └── request.model.js
│ │ ├── tasks/
│ │ │ ├── task.controller.js
│ │ │ ├── task.routes.js
│ │ │ └── task.model.js
│ │ └── submissions/
│ │ ├── submission.controller.js
│ │ ├── submission.routes.js
│ │ └── submission.model.js
├── uploads/ # Uploaded ZIP files
├── .env # Environment variables
├── package.json
└── README.md

---

## **Environment Variables (`.env`)**

```env
PORT=5000
MONGO_URI=mongodb+srv://marketplace-backend:GexdrzwJLT3jTC6B@saikat.r5nuz5u.mongodb.net/?appName=Saikat

JWT_SECRET=your_jwt_secret
```
