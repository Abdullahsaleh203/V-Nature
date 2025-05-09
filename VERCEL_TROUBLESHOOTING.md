# Fixing 500 Error on Vercel Deployment

This guide will help you correctly set up your environment variables and fix any internal server errors on your Vercel deployment.

## 1. Required Environment Variables

Make sure the following environment variables are set in your Vercel project settings:

### Essential Variables
- `DATABASE_URI`: Your MongoDB connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/v-nature)
- `JWT_SECRET_KEY`: A secret key for JWT tokens (use a strong, random string)
- `JWT_EXPIRES_IN`: Token validity period (e.g., 90d)
- `JWT_COOKIE_EXPIRES_IN`: Cookie validity period in days (e.g., 90)
- `NODE_ENV`: Set to "production" for Vercel

### Email Configuration (if using email features)
- `EMAIL_USERNAME`: Your email service username
- `EMAIL_PASSWORD`: Your email service password
- `EMAIL_HOST`: Your email service host
- `EMAIL_PORT`: Your email service port (usually 587)
- `EMAIL_FROM`: Sender email address

### Stripe Integration (if using payment features)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret for verifying webhook events

## 2. Setting Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on "Settings" tab
4. Find "Environment Variables" in the left menu
5. Add each variable with its corresponding value
6. Click "Save" when done
7. Redeploy your project with the new environment variables

## 3. MongoDB Connection

- Make sure your MongoDB Atlas cluster allows connections from anywhere (or specifically from Vercel's IP ranges)
- Verify that your database user has the correct permissions
- Check that your cluster is active and running

## 4. Fix for 500 Internal Server Error

The 500 error is likely due to one of these issues:

1. Missing or incorrect environment variables
2. Database connection issues
3. Server-side code errors

To troubleshoot:

1. Check Vercel deployment logs for specific error messages
2. Visit `https://v-nature.vercel.app/api/health` to see the server status
3. If database connection is failing, check your MongoDB connection string and network settings

## 5. Manual Fix Steps

If you continue to experience issues:

1. Ensure your MongoDB Atlas database is accessible from anywhere:
   - Go to Atlas dashboard → Network Access → Edit → Allow access from anywhere

2. Verify your database connection string:
   - Format should be: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`
   - Make sure to URL-encode special characters in your password

3. Redeploy after fixing environment variables:
   - Go to Vercel dashboard → Select your project → Deployments → "Redeploy" button

4. If nothing else works, try our fallback page:
   - Visit `https://v-nature.vercel.app/offline` to see if the site loads without database connection

## Need More Help?

If none of these solutions work, check the Vercel logs for specific error messages or contact technical support with the error details.
