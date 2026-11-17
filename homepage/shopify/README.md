# Stylish Naari on Shopify

Products, payment and checkout all run on Shopify. The website (this repo, deployed on Vercel) stays the shop window:
when a customer presses **Checkout** in the bag, the site creates a Shopify cart and sends them to Shopify's checkout,
where they pay and the order is placed. Orders, payments, stock and emails are all in Shopify admin.

Everything needed to load the catalogue into Shopify is in `import/` (made by `node _tools/export-shopify.cjs`, run from
`homepage/`; re-run it whenever products change).

| File | What it is | Where it goes |
|---|---|---|
| `import/products.csv` | All 117 sarees: title, description, details, price, SKU, tags, SEO, every photo with alt text | Products → Import |
| `import/collections.csv` | 13 collections (5 crafts, 2 Banarasi ranges, 5 edits, New arrivals) and the tag rule for each | Create by hand (step 5) |
| `import/prices-needed.csv` | The 61 sarees imported as **Draft** because they have no confirmed price | Fill in, then publish |
| `import/redirects.csv` | Old product and category links → new ones | Only if the shop later moves onto a Shopify theme |

## Set-up, in order

1. **Store settings.** Settings → Store details: currency **INR**, country India. Settings → Shipping and delivery:
   one zone for India with a **free** rate (shipping is free on every order in India; never add a charge). Leave
   international zones off; charges outside India are quoted by email.
2. **Payments.** Settings → Payments: add a gateway that takes UPI, cards, RuPay and net banking (Razorpay, PayU or
   Cashfree; Shopify Payments isn't offered in India). Don't turn on cash on delivery.
3. **Metafield definitions** (before importing, or those columns are skipped). Settings → Custom data → Products → Add
   definition, type *Single line text*, namespace and key exactly:
   `custom.name_meaning`, `custom.colour_line`, `custom.fabric`, `custom.border`, `custom.motif`.
4. **Import the products.** First make sure the latest site is pushed and deployed: Shopify downloads every photo from
   `https://stylish-naari.vercel.app/assets/images/…` (the `siteUrl` in `products.json → store.shopify`). Then Products
   → Import → `import/products.csv`. When importing again later, tick *Overwrite products with matching handles*.
   - 56 sarees with confirmed prices import as **Active**. 61 import as **Draft** at ₹0 (no price, or a placeholder
     price): see `prices-needed.csv`. Set the price, then change the status to Active.
   - Inventory isn't tracked (no stock counts have been supplied). Each saree is one of a kind, so once you know the
     stock, turn on *Track quantity* and set it to 1.
5. **Collections.** Products → Collections → Create collection → *Automated*, condition **Product tag is equal to** the
   tag in `collections.csv` (e.g. `category:banarasi`). Use the handle given so links match the site.
6. **Connect the site's checkout.**
   - Install the **Headless** sales channel (Shopify App Store, by Shopify) → Create storefront → copy the
     **public access token** (Storefront API).
   - Make every product available on the Headless channel (Products → select all → *Include in sales channels*), as
     well as Online Store.
   - In `homepage/assets/data/products.json`, under `store.shopify`, set
     `"storeDomain": "your-store.myshopify.com"` and `"storefrontToken": "<the public token>"`. Push. The Checkout
     button switches on by itself.
   - The public token is meant to be in website code; never put the Admin API token there.
7. **Policies.** Settings → Policies: paste in the site's Shipping, Refund (Exchanges), Privacy and Terms pages so they
   appear on Shopify's checkout too.
8. **Test.** Add a saree to the bag on the site → Checkout → you should land on Shopify's checkout with it in the cart.
   Use the gateway's test mode for a test payment.

## Good to know

- **Prices are charged by Shopify.** The site shows the price from `products.json`; Shopify charges its own price at
  checkout. Change a price in both places (or in `products.json`, then re-run the export and re-import with overwrite).
- **Handles = the site's slugs** (`/products/kajal` on the site is `kajal` in Shopify). Don't rename a handle in
  Shopify, or the bag can't find that saree at checkout.
- A saree that is Draft, or not on the Headless channel, can't be checked out: the bag names it and asks the customer to
  remove it.
- What the CSV can't carry: the gallery's zoomed close-ups (they are crops made on the page, not files), the saree
  videos, and the colour edit pages' layouts. Shopify gets the photographs themselves.
- **Moving onto a Shopify theme later** (instead of the Vercel site): the products, collections and handles are already
  in place; import `redirects.csv` (Content → Menus → URL redirects → Import) so old links keep working.
