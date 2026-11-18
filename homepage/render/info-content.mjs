// Content for the customer-help and policy pages: FAQ, Shipping policy, Exchange policy, Privacy policy,
// Terms & conditions, Saree care guide, Contact. Rendered by render/info.mjs. Kept apart from the markup so
// the client's final wording can be dropped in here.
//
// STATUS (16 Nov 2026): the policies are written. Their structure and timelines follow common practice for Indian
// saree labels (reference: themauve.co policies). Free shipping across India is fixed and is not to change. The
// remaining brackets are facts only the client can supply:
//   [Insert …]   a fact only the client can supply (registered name, address, GSTIN, support email)
//   [Confirm …]  a sentence written here that the client must confirm or delete before launch
// Both are shown on the page as marked placeholders (render/info.mjs → mark.placeholder), and a page that still has
// any shows the "Draft page" line under its title.
//
// Inline links: [[Link text|/path]]. Blocks: { p }, { ul: [] }, { ol: [] }, { note }.
// Policy pages can also carry `updated` (shown under the intro) and `glance` (the key terms, as
// [label, value, note] rows, shown as a strip above the text).

export const POLICY_UPDATED = '16 November 2026';

export const HELP_LINKS = [
  ['FAQs', '/faq'],
  ['Shipping policy', '/shipping'],
  ['Exchange policy', '/exchanges'],
  ['Privacy policy', '/privacy'],
  ['Terms & conditions', '/terms'],
  ['Saree care guide', '/care'],
  ['Contact us', '/contact'],
];

/* ─── FAQ ─────────────────────────────────────────────────── */
export const faq = {
  slug: 'faq',
  eyebrow: 'Help',
  title: 'Frequently asked questions',
  metaTitle: 'FAQs',
  description: 'Answers to common questions about ordering, free shipping across India, exchanges, our sarees and saree care at Stylissh Naari.',
  intro: 'Answers to the questions we are asked most often. If you can’t find what you need, [[get in touch|/contact]] and we will help.',
  groups: [
    { title: 'Orders & payments', items: [
      ['How do I place an order?', [{ p: 'Open the saree you would like, choose Add to bag, then go to your bag and continue to checkout. You can also use Quick add on the product cards in the collection.' }]],
      ['Which payment methods do you accept?', [{ p: 'We accept UPI, debit and credit cards (Visa, Mastercard and RuPay) and net banking. All prices are in Indian rupees and include GST.' }]],
      ['Is it safe to pay on the website?', [{ p: 'Yes. Checkout is secure and encrypted, and payments are handled by our payment partner. We never see or store your full card details.' }]],
            ['Do you offer cash on delivery?', [{ p: 'No. Every order is prepaid using one of the payment methods above.' }]],
      ['Will I receive an order confirmation?', [{ p: 'Yes. As soon as you place an order we email a confirmation to the address you used at checkout. If you can’t find it, check your spam or promotions folder.' }]],
            ['Can I change or cancel my order?', [{ p: 'You can cancel or change your order before it is dispatched. [[Contact us|/contact]] with your order number as soon as possible. See [[cancellations|/exchanges#cancellations]].' }]],
    ] },
    { title: 'Shipping & delivery', items: [
            ['Do you charge for shipping?', [{ p: 'No. Delivery is free on every order shipped within India, with no minimum order value. For orders outside India, we will tell you the shipping charges by email.' }]],
            ['How long will my order take to arrive?', [{ p: 'Orders are dispatched within 4–12 days, depending on availability, and we confirm the timeline by email. Delivery then takes 6–12 working days. Nothing is dispatched on weekends or public holidays. See [[delivery times|/shipping#timelines]].' }]],
            ['Where do you deliver?', [{ p: 'We deliver across India and to other countries. Delivery within India is free; for international orders, we will email you the shipping charges. See [[shipping outside India|/shipping#destinations]].' }]],
            ['How do I track my order?', [{ p: 'Once your order has been shipped, we email you a shipment confirmation and your tracking details. Tracking becomes active within 24–48 hours of shipping. See [[tracking|/shipping#tracking]].' }]],
    ] },
    { title: 'Exchanges', items: [
            ['Can I exchange a saree?', [{ p: 'Only if it arrives damaged or with a misprint. You can request an exchange within 14 days of receiving it, if the saree is unused and unworn with its tags and labels in place, and you share your unboxing video. Handloom, customised and sale items can’t be exchanged. The full conditions are in our [[Exchange policy|/exchanges]].' }]],
            ['Do you offer refunds?', [{ p: 'We don’t accept returns. An approved exchange is settled with a store credit note, which you can use towards any saree straight away or within 15 days. See [[store credit|/exchanges#store-credit]].' }]],
      ['Why do you ask for an unboxing video?', [{ p: 'A continuous, unedited video of you opening the sealed parcel lets us settle any damage, missing-item or wrong-item claim quickly and fairly, with our courier partner too. Please record one whenever you open an order.' }]],
            ['My saree arrived damaged or is not what I ordered. What should I do?', [{ p: 'Let us know immediately. Email [[stylisshnaari3552026@gmail.com|mailto:stylisshnaari3552026@gmail.com]] with your order number with photographs or videos of the problem and your unboxing video, and we will review it. See [[damaged or incorrect items|/exchanges#damaged]].' }]],
    ] },
    { title: 'Our sarees', items: [
      ['Does the saree come with a blouse piece?', [{ p: 'Where a blouse piece is included, it is listed in the product details. [Confirm the standard blouse piece policy, e.g. included and unstitched].' }]],
            ['How long is each saree?', [{ p: 'Our sarees are between 6.3 and 6.5 metres long. The length of each saree is listed in its product details.' }]],
      ['Will the colour look exactly like the photographs?', [{ p: 'We photograph each saree to show its colour as faithfully as we can, but colours can look slightly different because of studio lighting and your screen settings. A slight difference in shade is not a defect and isn’t grounds for an exchange.' }]],
      ['Why does my saree have small irregularities?', [{ p: 'Handwoven and hand-finished sarees carry the marks of the hands that made them: a slightly uneven thread, a small variation in the weave or print. These are part of the craft, not defects, and no two pieces are exactly alike.' }]],
    ] },
    { title: 'Saree care', items: [
      ['How should I clean my saree?', [{ p: 'Always follow the care label that comes with your saree. Most silk and zari sarees should be dry-cleaned. Our [[Saree care guide|/care]] has general advice by fabric.' }]],
      ['How should I store silk sarees?', [{ p: 'Store silk folded in a breathable cotton or muslin cover, away from direct sunlight and damp, and refold it every few months so the creases don’t set. More in the [[Saree care guide|/care#storage]].' }]],
    ] },
    { title: 'Account & support', items: [
      ['How do I save sarees for later?', [{ p: 'Tap the heart on any saree in the collection to keep it in your [[Wishlist|/wishlist]]. The wishlist is saved on the device and browser you used.' }]],
            ['How can I contact you?', [{ p: 'Email us at [[stylisshnaari3552026@gmail.com|mailto:stylisshnaari3552026@gmail.com]], call or WhatsApp us on [[+91 73048 12124|tel:+917304812124]], or use the form on our [[Contact page|/contact]].' }]],
    ] },
  ],
};

/* ─── Shipping policy ─────────────────────────────────────── */
// Client's answers, 17 Nov 2026 (launch questions document): dispatch 4–12 days by availability, confirmed by email;
// no dispatch on weekends or holidays; delivery 6–12 working days; tracking active within 24–48 hours, shared by email;
// no cash on delivery; free delivery in India; outside India, charges are given by email.
export const shipping = {
  slug: 'shipping',
  eyebrow: 'Policies',
  title: 'Shipping policy',
  description: 'Free shipping on every Stylissh Naari order across India: dispatch times, delivery estimates, tracking, international orders and what to do if a parcel is delayed.',
  intro: 'Every order ships free across India, with no minimum order value. Here is how your saree is prepared, sent and delivered.',
  updated: POLICY_UPDATED,
  glance: [
    ['Shipping', 'Free across India', 'On every order, no minimum'],
    ['Dispatch', '4–12 days', 'Depending on availability'],
    ['Delivery', '6–12 working days', 'We email you if it changes'],
    ['Tracking', 'Within 24–48 hours', 'Sent by email once shipped'],
  ],
  sections: [
    { id: 'free-shipping', title: 'Free shipping across India', body: [
      { p: 'Delivery is free on every order shipped to an address in India, whatever its value. There are no shipping charges at checkout.' },
      { p: 'All orders are prepaid. We don’t offer cash on delivery.' },
    ] },
    { id: 'processing', title: 'Order processing and dispatch', body: [
      { p: 'Orders are dispatched within 4–12 days, depending on the availability of the saree you have chosen. We will confirm the dispatch timeline for your order by email.' },
      { p: 'Orders are dispatched on working days only; nothing is shipped on weekends or public holidays.' },
      { p: 'When we receive a high volume of orders, for example during festivals and sales, dispatch may be delayed by a few working days.' },
    ] },
    { id: 'timelines', title: 'Delivery times', body: [
      { p: 'Delivery takes 6–12 working days. If your order is delayed for any reason beyond our control, we will let you know by email.' },
    ] },
    { id: 'tracking', title: 'Shipment confirmation and tracking', body: [
      { p: 'Once your order has been shipped, we will send you a shipment confirmation email.' },
      { p: 'Your tracking details will also be shared by email. Tracking becomes active within 24–48 hours of shipping.' },
    ] },
    { id: 'destinations', title: 'Shipping outside India', body: [
      { p: 'We also deliver outside India. Shipping charges for international orders depend on the destination; we will tell you the charges for your order by email before it is shipped.' },
    ] },
    { id: 'receiving', title: 'Receiving your parcel', body: [
      { ul: [
        'Record a continuous, unedited video while you open the parcel. It is required for any exchange or damage claim.',
        'Inspect your order carefully as soon as you receive it.',
        'If anything is damaged, defective or not what you ordered, let us know immediately. See [[damaged or incorrect items|/exchanges#damaged]].',
      ] },
    ] },
    { id: 'delays', title: 'Delayed shipments', body: [
      { p: 'If your order hasn’t arrived within the delivery time above, or your tracking hasn’t updated, [[contact us|/contact]] with your order number and we will follow it up with our courier partner.' },
    ] },
    { id: 'address', title: 'Shipping address', body: [
      { p: 'Please check your shipping address, PIN code and phone number carefully before placing your order. The courier may call the number you give us to complete delivery.' },
      { p: 'Need to change something? [[Contact us|/contact]] as soon as possible. Once an order has been dispatched we may not be able to redirect it.' },
    ] },
  ],
};

/* ─── Exchange policy ─────────────────────────────────────── */
// Client's answers, 17 Nov 2026: no returns; no return or exchange on handloom or customised products; exchange
// within 14 days only for damage or misprints, never for colour preference or dislike; unused, unworn, tags and labels
// on; unpacking video required; request by email, ship only to the address we email; customer pays exchange shipping;
// no exchange on sale items or gift cards; an approved exchange is settled with a store credit note, to be used
// immediately or within 15 days.
export const exchanges = {
  slug: 'exchanges',
  eyebrow: 'Policies',
  title: 'Exchange policy',
  metaTitle: 'Exchange policy',
  description: 'The Stylissh Naari exchange policy: what can be exchanged, the 14-day window, the unboxing video, damaged or incorrect items, shipping and store credit.',
  intro: 'Every saree is checked before it leaves us. If yours arrives damaged or misprinted, you can request an exchange within 14 days of receiving it. This page explains when an exchange is possible and how it works.',
  updated: POLICY_UPDATED,
  glance: [
    ['Exchange window', '14 days', 'From the day you receive it'],
    ['Accepted for', 'Damage or misprints', 'Not for colour or preference'],
    ['Proof', 'Unboxing video', 'Required with every request'],
    ['Settled as', 'Store credit', 'Use it within 15 days'],
  ],
  sections: [
    { id: 'overview', title: 'Our policy in short', body: [
      { p: 'We do not accept returns. Instead, we offer exchanges in a few unforeseen situations: when a saree arrives damaged or with a misprint. Requests must be made within 14 days of receiving your order.' },
      { p: 'An approved exchange is settled with a store credit note, which you can use towards any saree of your choice. See [[store credit|#store-credit]].' },
    ] },
    { id: 'not-eligible', title: 'What we can’t exchange', body: [
      { ul: [
        'Handloom sarees and any customised product: these can be neither returned nor exchanged',
        'Sarees bought in a sale, and gift cards',
        'Exchanges requested because of colour preference, or because you don’t like the saree once you receive it',
      ] },
      { p: 'Colours can look slightly different from our photographs because of studio lighting and screen settings. Handloom sarees may also have small irregularities in the weave or print. These are part of the beauty of a handmade piece, not damage, and are not grounds for an exchange.' },
    ] },
    { id: 'eligibility', title: 'Exchange eligibility', body: [
      { p: 'A saree is eligible for exchange only if:' },
      { ul: [
        'it is damaged or has a misprint',
        'it is unused and unworn',
        'all its price tags and labels are still in place',
        'you share a continuous, unedited unboxing video of the parcel with your request',
      ] },
    ] },
    { id: 'process', title: 'How to request an exchange', body: [
      { ol: [
        'Email us at [[stylisshnaari3552026@gmail.com|mailto:stylisshnaari3552026@gmail.com]] within 14 days of receiving your order. Include your order number, a description of the problem, photographs or videos of the damage or misprint, and your unboxing video.',
        'We will review your request. If it is accepted, we will email you with instructions on how and where to send the saree.',
        'Send the saree only to the address we give you by email, with its price tags and labels in place.',
        'Once we have received and checked the saree, we will issue your store credit note.',
      ] },
      { p: 'Please don’t send anything back before you have asked for an exchange and received our reply. Parcels sent to us without a request first will not be accepted.' },
    ] },
    { id: 'damaged', title: 'Damaged, defective or incorrect items', body: [
      { ul: [
        'Record a video while you open the parcel.',
        'Inspect your order carefully as soon as you receive it.',
        'If the saree is defective or damaged, or you have received the wrong item, let us know immediately.',
        'Share photographs or videos of the problem together with your unboxing video, so we can review it quickly.',
      ] },
    ] },
    { id: 'shipping-costs', title: 'Exchange shipping', body: [
      { p: 'The cost of shipping a saree back to us for an exchange is paid by the customer.' },
    ] },
    { id: 'store-credit', title: 'Store credit note', body: [
      { p: 'When your exchange is approved, we will send you a store credit note. You can use it to buy any product of your choice, straight away or within 15 days.' },
      { p: 'Once the store credit note has expired, the exchange can no longer be honoured.' },
    ] },
    { id: 'cancellations', title: 'Cancellations', body: [
      { p: 'You can cancel your order before it is dispatched. [[Contact us|/contact]] with your order number as soon as possible. [Confirm: how a cancelled order is refunded and how long it takes].' },
      { p: 'We may cancel an order if a saree is unexpectedly out of stock, if it was listed at an incorrect price, or if we can’t verify the payment. If we do, we will let you know and refund you in full.' },
    ] },
    { id: 'help', title: 'Need help?', body: [
      { p: 'For anything about an exchange or a damaged item, [[contact us|/contact]] with your order number and we will help.' },
    ] },
  ],
};

/* ─── Saree Care Guide ────────────────────────────────────── */
export const care = {
  slug: 'care',
  eyebrow: 'Help',
  title: 'Saree care guide',
  description: 'How to clean, dry, iron, fold and store your sarees, with general advice for silk, cotton and delicate or embellished sarees.',
  intro: 'A well-kept saree lasts for generations. This guide gives general advice for looking after yours. Every saree is different, so always follow the care label that comes with it first.',
  sections: [
    { id: 'general', title: 'Everyday care', body: [
      { ul: [
        'Air your saree for a while after wearing it before you put it away, so perspiration and moisture can dry out.',
        'Spray perfume and deodorant before you drape your saree, not onto the fabric, and keep it away from oils and make-up where you can.',
        'Treat any stain as soon as possible and do not rub it. For anything more than a light mark, take it to a professional cleaner.',
      ] },
    ] },
    { id: 'cleaning', title: 'Washing and cleaning', body: [
      { p: 'How a saree should be cleaned depends on its fabric, dyes, weave and any zari or embellishment. Some sarees can be hand-washed; many should only be dry-cleaned. If the label says dry-clean only, please don’t wash it at home.' },
      { p: 'For your first wash, check for colour bleeding on a hidden corner, and wash deep or bright colours separately.' },
    ] },
    { id: 'drying', title: 'Drying and ironing', body: [
      { ul: [
        'Dry sarees flat or on a padded hanger in the shade. Direct sunlight can fade colours.',
        'Do not wring or twist a saree to remove water.',
        'Iron on the reverse at a low to medium setting suited to the fabric, with a pressing cloth between the iron and any zari, embroidery or print.',
        'Do not iron directly on zari, sequins, stones or embellishment.',
      ] },
    ] },
    { id: 'storage', title: 'Folding and long-term storage', body: [
      { ul: [
        'Store sarees folded in breathable cotton or muslin covers rather than plastic, which traps moisture.',
        'Keep them somewhere cool and dry, away from direct sunlight and damp walls.',
        'Refold your sarees every few months along different lines, so the fibres don’t weaken where they are creased.',
        'Wrap zari and embellished sarees in soft cotton or acid-free tissue to stop the metallic threads tarnishing or catching on other fabrics.',
        'Use natural repellents such as neem leaves or cedar in your wardrobe, wrapped so they never touch the fabric. Avoid naphthalene balls directly on silk.',
      ] },
    ] },
    { id: 'fabric', title: 'Care by fabric', verify: true, body: [
      { note: 'General guidance, to be verified by Stylissh Naari or a textile expert before publishing. The care label on your saree always comes first.' },
    ], fabrics: [
      ['Silk and Banarasi silk', [
        'Dry-cleaning is usually recommended, especially for sarees with zari.',
        'If the care label allows hand-washing, use cold water and a mild detergent made for silk, and do not soak.',
        'Iron on the reverse at a low silk setting with a pressing cloth.',
      ]],
      ['Cotton', [
        'Many cotton sarees can be hand-washed separately in cold water with a mild detergent. Check the label first.',
        'Colours may bleed in the first few washes, so wash on their own.',
        'Iron while slightly damp at a medium setting. Starch only if the label allows it.',
      ]],
      ['Delicate, sheer and embellished sarees', [
        'Organza, tissue, embroidered and embellished sarees are usually dry-clean only.',
        'Store them flat or loosely rolled with tissue between the layers, so embroidery and sequins don’t crush or snag.',
        'Never iron directly on embroidery or embellishment. Use a pressing cloth, or steam gently from a distance.',
      ]],
    ] },
    { id: 'label', title: 'Always check the care label', body: [
      { p: 'Each saree comes with care instructions for its own fabric and finish. Where the label and this guide differ, follow the label. [Confirm whether every saree is shipped with a care label or card].' },
    ] },
    { id: 'questions', title: 'Questions about caring for your saree?', body: [
      { p: 'If you’re unsure how to care for a particular saree, [[contact us|/contact]] with the saree’s name or your order number and we will advise you.' },
    ] },
  ],
};

/* ─── Contact ─────────────────────────────────────────────── */
export const contact = {
  slug: 'contact',
  eyebrow: 'Contact',
  title: 'Get in touch',
  metaTitle: 'Contact us',
  description: 'Contact Stylissh Naari about an order, shipping, returns or any of our sarees.',
  intro: 'Questions about an order, a saree or anything else? Send us a message and we will get back to you as soon as we can.',
  enquiries: ['Order status', 'Shipping', 'Returns & exchanges', 'Product information', 'Other'],
};

/* ─── Privacy policy ──────────────────────────────────────── */
export const privacy = {
  slug: 'privacy',
  eyebrow: 'Policies',
  title: 'Privacy policy',
  description: 'How Stylissh Naari collects, uses, shares and protects your personal information when you shop with us, and the choices you have.',
  intro: 'Your trust matters to us. This policy explains what personal information we collect when you visit or shop with Stylissh Naari, how we use it, and the choices you have.',
  updated: POLICY_UPDATED,
  sections: [
    { id: 'about', title: 'About this policy', body: [
      { p: 'This policy applies to this website and to orders, messages and services connected with it (together, our “services”). Stylissh Naari is operated by Stylissh Naari, Brindaban Complex, Majiwada, Thane West, Maharashtra, India (“we”, “us”, “our”).' },
      { p: 'By using our services you agree to this policy. We process personal information in line with Indian law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.' },
    ] },
    { id: 'collect', title: 'Information we collect', body: [
      { p: '**Information you give us**, when you place an order, create a wishlist, subscribe to our letters or contact us:' },
      { ul: [
        'your name, email address and phone number',
        'billing and shipping addresses',
        'order details, such as the sarees you bought, and payment confirmation',
        'messages, photographs and unboxing videos you send us about an order or an exchange',
      ] },
      { p: '**Information collected automatically**, through cookies and similar technologies, when you use the website: your device, browser, IP address, approximate location, the pages you visit and how you use them.' },
      { p: '**Information from others**: our payment partner confirms whether a payment succeeded, and our courier partners share delivery updates.' },
    ] },
    { id: 'use', title: 'How we use your information', body: [
      { ul: [
        'to process, ship and deliver your orders, and to send order, dispatch and delivery updates',
        'to handle exchanges, cancellations, refunds and any claim about a damaged or incorrect item',
        'to answer your questions and provide customer support',
        'to send you our letters, new arrivals and offers, if you have agreed to receive them',
        'to understand how the website is used and improve it',
        'to prevent fraud, keep our services secure and meet our legal, tax and accounting obligations',
      ] },
    ] },
    { id: 'cookies', title: 'Cookies', body: [
      { p: 'Cookies are small files stored on your device. We use them to make the website work (for example, to remember your bag and wishlist), to understand how it is used, and, where you allow it, to show you relevant advertising.' },
      { p: 'You can block or delete cookies in your browser settings. Some parts of the website, such as the bag, may not work properly without them.' },
    ] },
    { id: 'sharing', title: 'How we share your information', body: [
      { p: 'We never sell your personal information. We share it only as needed to run our services:' },
      { ul: [
        'with our payment partner, to process your payment',
        'with our courier partners, to deliver your order',
        'with service providers who host the website, send our emails and help us with analytics and customer support, under agreements that require them to protect it',
        'where the law requires it, or to protect our rights, our customers and our business',
        'with a buyer or successor if our business is sold or reorganised',
      ] },
    ] },
    { id: 'payments', title: 'Payments', body: [
      { p: 'Payments are processed securely by our payment partner over an encrypted connection. We never see or store your full card number, CVV, UPI PIN or net-banking password.' },
    ] },
    { id: 'retention', title: 'How long we keep it', body: [
      { p: 'We keep your information only as long as we need it for the purposes above: for as long as you shop with us, and afterwards for as long as the law requires us to keep order and tax records, or to resolve a dispute.' },
    ] },
    { id: 'security', title: 'Keeping it safe', body: [
      { p: 'We use reasonable technical and organisational safeguards to protect your information. No method of transmission or storage is completely secure, so we can’t guarantee absolute security, but we work to protect your information and will tell you if a breach affects you, as the law requires.' },
    ] },
    { id: 'rights', title: 'Your rights and choices', body: [
      { ul: [
        'Ask for a summary of the personal information we hold about you',
        'Ask us to correct, complete or update it',
        'Ask us to delete it, where we don’t need to keep it by law',
        'Withdraw your consent at any time, for example to marketing',
        'Nominate someone to exercise these rights on your behalf',
        'Raise a complaint with our grievance officer, and then with the Data Protection Board of India',
      ] },
      { p: 'Every marketing email has an unsubscribe link. To exercise any other right, [[contact us|/contact]]. We may need to confirm your identity before acting on a request.' },
    ] },
    { id: 'children', title: 'Children', body: [
      { p: 'Our services are intended for people aged 18 and over. We don’t knowingly collect personal information from children. If you believe a child has given us their information, [[contact us|/contact]] and we will delete it.' },
    ] },
    { id: 'changes', title: 'Changes to this policy', body: [
      { p: 'We may update this policy from time to time to reflect changes to our services or the law. The date at the top of this page shows when it was last updated.' },
    ] },
    { id: 'contact', title: 'Contact and grievance officer', body: [
      { p: 'For any question or complaint about your privacy, [[contact us|/contact]] or write to our grievance officer:' },
      { ul: [
        'Email: [[stylisshnaari3552026@gmail.com|mailto:stylisshnaari3552026@gmail.com]]',
        'Phone: [[+91 73048 12124|tel:+917304812124]]',
        'Address: Stylissh Naari, Brindaban Complex, Majiwada, Thane West, Maharashtra, India',
      ] },
      { p: 'We will acknowledge your complaint within 24 hours and resolve it within 15 days.' },
    ] },
  ],
};

/* ─── Terms & conditions ──────────────────────────────────── */
export const terms = {
  slug: 'terms',
  eyebrow: 'Policies',
  title: 'Terms & conditions',
  description: 'The terms that apply when you use the Stylissh Naari website and buy from us: orders, pricing, payment, shipping, exchanges, intellectual property and liability.',
  intro: 'These terms apply when you use this website or buy from Stylissh Naari. Please read them carefully: by using the website or placing an order, you agree to them.',
  updated: POLICY_UPDATED,
  sections: [
    { id: 'overview', title: 'Overview', body: [
      { p: 'This website is operated by Stylissh Naari, Brindaban Complex, Majiwada, Thane West, Maharashtra, India, GSTIN 27AVTPM2829F2Z5 (“Stylissh Naari”, “we”, “us”, “our”). “You” means anyone who uses the website or buys from us.' },
      { p: 'These terms should be read with our [[Shipping policy|/shipping]], [[Exchange policy|/exchanges]] and [[Privacy policy|/privacy]], which form part of them.' },
    ] },
    { id: 'eligibility', title: 'Using the website', body: [
      { ul: [
        'You must be at least 18 years old, or use the website with the involvement of a parent or guardian.',
        'You agree to give accurate, current and complete information when you place an order, and to keep it up to date.',
        'You agree not to use the website for any unlawful purpose, to interfere with its security or operation, or to upload anything harmful or offensive. If you do, we may suspend or end your access.',
      ] },
    ] },
    { id: 'products', title: 'Our sarees', body: [
      { p: 'We take care to describe and photograph every saree accurately. Even so:' },
      { ul: [
        'Colours can look slightly different on screen than in person, depending on your device and lighting.',
        'Many of our sarees are handwoven or hand-finished. Slight irregularities in weave, print or colour are part of the craft and are not defects.',
        'Measurements are approximate and can vary slightly from piece to piece.',
        'Styling, jewellery and accessories shown in photographs are not included unless the product description says so.',
      ] },
    ] },
    { id: 'pricing', title: 'Prices', body: [
      { p: 'All prices are in Indian rupees (₹) and include GST. Shipping within India is free; shipping charges for orders outside India are shared by email. Prices and availability can change without notice, but a change won’t affect an order we have already confirmed.' },
      { p: 'If a saree is listed at an incorrect price because of an error, we may cancel the order and refund you in full, even after it has been confirmed.' },
    ] },
    { id: 'orders', title: 'Orders', body: [
      { p: 'Your order is an offer to buy. It is accepted when we dispatch it. We may refuse or cancel an order, or limit the quantity bought per person, household, address or payment method, for example when a saree is out of stock, when we can’t verify a payment, or when an order appears to be placed by a reseller. If we cancel an order after payment, we will tell you and refund you in full.' },
    ] },
    { id: 'payment', title: 'Payment', body: [
      { p: 'Orders are paid for in full at checkout by UPI, card or net banking. Payments are processed securely by our payment partner; we don’t store your card details. You confirm that you are authorised to use the payment method you choose.' },
    ] },
    { id: 'shipping', title: 'Shipping, exchanges and cancellations', body: [
      { p: 'How we deliver your order is set out in our [[Shipping policy|/shipping]]. Exchanges, refunds and cancellations are covered by our [[Exchange policy|/exchanges]]. Responsibility for an order passes to you when it is delivered.' },
    ] },
    { id: 'ip', title: 'Intellectual property', body: [
      { p: 'Everything on this website, including our photographs, films, designs, text, logo and the Stylissh Naari name, belongs to us or our licensors and is protected by law. You may not copy, reproduce, sell or use any of it for commercial purposes without our written permission.' },
    ] },
    { id: 'content', title: 'Reviews and messages', body: [
      { p: 'If you send us reviews, photographs, comments or ideas, you allow us to use, edit and publish them in connection with our business, without payment. You confirm that they are your own, are accurate and don’t infringe anyone’s rights. We may remove any content we consider unlawful, offensive or misleading.' },
    ] },
    { id: 'links', title: 'Third-party links', body: [
      { p: 'The website may link to other websites, such as our social media pages. We are not responsible for their content or practices.' },
    ] },
    { id: 'liability', title: 'Limitation of liability', body: [
      { p: 'We work to keep the website accurate and available, but it is provided “as is” and we don’t guarantee that it will always be uninterrupted or error-free.' },
      { p: 'To the fullest extent the law allows, we are not liable for any indirect or consequential loss arising from your use of the website or our products. Our total liability for any order is limited to the amount you paid for it. Nothing in these terms limits your rights as a consumer under Indian law.' },
    ] },
    { id: 'indemnity', title: 'Indemnity', body: [
      { p: 'You agree to compensate us for any claim, loss or expense arising from your breach of these terms or your misuse of the website.' },
    ] },
    { id: 'law', title: 'Governing law', body: [
      { p: 'These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts of Mumbai.' },
    ] },
    { id: 'changes', title: 'Changes to these terms', body: [
      { p: 'We may update these terms from time to time. The version on this page when you place an order applies to that order. The date at the top of this page shows when they were last updated.' },
    ] },
    { id: 'contact', title: 'Contact', body: [
      { p: 'Questions about these terms? [[Contact us|/contact]] and we will be glad to help.' },
    ] },
  ],
};
