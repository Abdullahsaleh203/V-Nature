# Vercel Deployment Guide

## Prerequisites
- A Vercel account
- MongoDB Atlas database (or any MongoDB hosting)
- Node.js 20.x or lower

## Steps to Deploy on Vercel

### 1. Set up Environment Variables
In your Vercel project settings, add the following environment variables:

```
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET_KEY=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
NODE_ENV=production
```

Add any other environment variables required by your application (check .env.example).

### 2. Deploy to Vercel

- Push your code to a Git repository (GitHub, GitLab, etc.)
- Import your project in Vercel dashboard
- Make sure the framework preset is "Node.js"
- Deploy

### 3. Troubleshooting

If your deployment doesn't work:

1. Check Vercel logs for any errors
2. Ensure all environment variables are properly set
3. Verify your MongoDB connection string is correct and accessible from Vercel
4. Make sure your Node.js version is supported (set to 20.x in package.json)
5. Check if your project builds locally with `npm run build`

## Local Development

1. Copy `.env.example` to `.env` and fill in your details
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server

## Notes for Vercel Deployment

- Vercel has a serverless architecture, which means your Express app runs as a serverless function
- Static assets in the `public` folder are served directly
- API routes are handled through `server.js`
- The deployment might take a few minutes to fully propagate across Vercel's CDN
