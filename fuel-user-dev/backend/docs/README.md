# FuelFriendly App

Fuel-friendly app for ordering snacks and drinks at gas stations.

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   Copy [.env.local.template](.env.local.template) to [.env.local](.env.local) and fill in your API keys:
   ```
   cp .env.local.template .env.local
   ```

3. Configure SendGrid Email Service (for Email OTP):
   - Sign up at [SendGrid](https://sendgrid.com/)
   - Get your API Key from the SendGrid dashboard
   - Update the following variables in [.env.local](.env.local):
     ```
     SENDGRID_API_KEY=your_sendgrid_api_key
     SENDGRID_FROM_EMAIL=noreply@fuelfriendly.com
     ```

4. Run the app:
   ```
   npm run dev
   ```

5. Run the backend server:
   ```
   npm run server
   ```

## Deployment

For production deployment, make sure to set all environment variables in your deployment environment.