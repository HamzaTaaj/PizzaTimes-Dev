# Setting Up Shopify Metaobjects for Access Requests

## 🎯 Goal
Store access requests in a separate table in Shopify (not mixed with customers).

## 📋 Step-by-Step Setup

### Step 1: Create Metaobject Definition

1. **Go to Shopify Admin**
   - URL: https://admin.shopify.com/store/pizza-anytime-2

2. **Navigate to Metaobjects**
   - Settings → Custom data → Metaobjects
   - OR directly: https://admin.shopify.com/store/pizza-anytime-2/settings/custom_data

3. **Create New Definition**
   - Click **"Add definition"**
   - Name: `Access Request`
   - Type: `access_request` (auto-generated)
   - Click **"Add"**

### Step 2: Add Fields to the Definition

Add the following fields to your `Access Request` metaobject:

| Field Name | Type | Required |
|------------|------|----------|
| First Name | Single line text | Yes |
| Last Name | Single line text | Yes |
| Email | Single line text | Yes |
| Company | Single line text | Yes |
| Location | Single line text | No |
| Machine Count | Single line text | No |
| Role | Single line text | No |
| Message | Multi-line text | No |
| Status | Single line text | Yes (default: "pending") |
| Submitted At | Single line text | Yes |

**For each field:**
1. Click **"Add field"**
2. Select the type
3. Enter the name
4. Set validation (Required/Optional)
5. Click **"Save"**

### Step 3: Enable Web Access (Optional)

Under **"Web pages"** settings:
- Toggle **"Add web page with template"** → OFF
- We don't need public web pages for this data

### Step 4: Save the Definition

Click **"Save"** at the top right.

## ✅ Result

You'll now have a separate "Access Requests" table in Shopify that you can:
- View at: Settings → Custom data → Metaobjects → Access Requests
- Filter and search entries
- Export to CSV
- View in a clean table format

## 📊 How It Will Look

```
Access Requests (12 entries)
┌────────────┬────────────┬───────────────────────┬──────────────┬──────────┐
│ First Name │ Last Name  │ Email                 │ Company      │ Status   │
├────────────┼────────────┼───────────────────────┼──────────────┼──────────┤
│ John       │ Doe        │ john@example.com      │ Example Corp │ Pending  │
│ Jane       │ Smith      │ jane@company.com      │ ABC Inc      │ Approved │
│ ...        │ ...        │ ...                   │ ...          │ ...      │
└────────────┴────────────┴───────────────────────┴──────────────┴──────────┘
```

## 🔗 Quick Link

After setup, admin can access requests here:
https://admin.shopify.com/store/pizza-anytime-2/settings/custom_data/metaobjects/access_request

---

**Complete this setup first, then I'll update the API to use metaobjects instead of customers!**

