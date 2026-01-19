# Fix: Blog API Permission Issue

## Error:
```
[API] This action requires merchant approval for read_content scope.
```

## Solution:

### Step 1: Go to Shopify Admin
1. Login to your Shopify Admin Panel
2. Go to **Settings** → **Apps and sales channels**
3. Click **App development** (or your custom app name)

### Step 2: Add Content Permissions
1. Find your app (the one with Admin API access token)
2. Click on **Configuration**
3. Scroll to **Admin API access scopes**
4. Search for `read_content` or `content`
5. Enable the following permissions:
   - ✅ `read_content` - Read blog posts and articles
   - ✅ `read_blog` - Read blog information (if available)

### Step 3: Save and Reinstall
1. Click **Save**
2. Go to **API credentials** tab
3. Click **Install app** (or reinstall if already installed)
4. **Copy the new Admin API access token** (you'll need it)

### Step 4: Update Environment Variable
1. Update your `.env` file with the new token:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_new_token_here
   ```

2. If using Vercel, update the environment variable:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `SHOPIFY_ADMIN_ACCESS_TOKEN`

### Step 5: Restart Server
```bash
# Kill old server
pkill -f "node server.js"

# Start new server
node server.js
```

### Step 6: Test
Refresh your browser - blogs should now load!

---

**Note:** After adding permissions, Shopify may require you to reinstall the app and get a new access token.
