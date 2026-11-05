// Content for the customer-help pages: FAQ, Shipping & Delivery, Returns & Exchanges, Saree Care Guide, Contact.
// Rendered by render/info.mjs. Kept apart from the markup so the client's final wording can be dropped in here.
//
// STATUS: PLACEHOLDER COPY. The client has not supplied policies, timelines, charges or contact details yet.
//   [Insert …]   a fact only the client can supply (a timeline, a charge, a policy, a contact detail)
//   [Confirm …]  a sentence written here that the client must confirm or delete before launch
// Both are shown on the page as marked placeholders (render/info.mjs → mark.placeholder). Nothing in brackets
// is a commitment. Care advice marked `verify: true` must be checked by the client or a textile expert.
//
// Inline links: [[Link text|/path]]. Blocks: { p }, { ul: [] }, { ol: [] }, { note }.

export const HELP_LINKS = [
  ['FAQ', '/faq'],
  ['Shipping & Delivery', '/shipping'],
  ['Returns & Exchanges', '/returns'],
  ['Saree Care Guide', '/care'],
  ['Contact us', '/contact'],
];

/* ─── FAQ ─────────────────────────────────────────────────── */
export const faq = {
  slug: 'faq',
  eyebrow: 'Help',
  title: 'Frequently Asked Questions',
  metaTitle: 'FAQ',
  description: 'Answers to common questions about ordering, shipping, returns, our sarees and saree care at Stylish Naari.',
  intro: 'Answers to the questions we are asked most often. If you can’t find what you need, [[get in touch|/contact]] and we will help.',
  groups: [
    { title: 'Orders & Payments', items: [
      ['How do I place an order?', [{ p: 'Open the saree you would like, choose Add to bag, then go to the bag and continue to checkout. You can also use Quick add on the product cards in the collection.' }]],
      ['Which payment methods do you accept?', [{ p: 'We accept [Insert accepted payment methods]. The options available to you are shown at checkout.' }]],
      ['Is it safe to pay on the website?', [{ p: 'Payments are handled by [Insert payment provider] at checkout. [Confirm how card and payment details are processed and stored].' }]],
      ['Do you offer cash on delivery?', [{ p: '[Insert whether cash on delivery is available, and for which locations or order values].' }]],
      ['Will I receive an order confirmation?', [{ p: 'After you place an order, a confirmation is sent to the email address you used at checkout. [Confirm whether confirmations are also sent by SMS or WhatsApp].' }]],
      ['Can I change or cancel my order?', [{ p: '[Insert whether and until when an order can be changed or cancelled]. See [[Returns & Exchanges|/returns#cancellations]] for the cancellation policy.' }]],
    ] },
    { title: 'Shipping & Delivery', items: [
      ['Where do you deliver?', [{ p: 'We currently deliver to [Insert shipping destinations]. See [[Shipping & Delivery|/shipping#destinations]] for details.' }]],
      ['How long will my order take to arrive?', [{ p: 'Orders are usually processed within [Insert processing time] and delivered within [Insert delivery estimates] after dispatch. Delivery times can vary by location.' }]],
      ['How much does shipping cost?', [{ p: '[Insert shipping charges and any free-shipping threshold]. The final shipping cost is shown at checkout before you pay.' }]],
      ['How do I track my order?', [{ p: 'Once your order has been dispatched, [Insert how tracking details are shared, e.g. by email or SMS]. See [[order tracking|/shipping#tracking]].' }]],
    ] },
    { title: 'Returns & Exchanges', items: [
      ['Can I return a saree?', [{ p: '[Insert return eligibility]. The full conditions are on the [[Returns & Exchanges|/returns]] page.' }]],
      ['Can I exchange a saree?', [{ p: '[Insert whether exchanges are offered and on what basis]. See [[exchanges|/returns#exchanges]].' }]],
      ['When will I receive my refund?', [{ p: 'Refunds are processed within [Insert refund processing time] of the returned item being received and checked, to [Insert refund method].' }]],
      ['My saree arrived damaged or is not what I ordered. What should I do?', [{ p: 'Please [[contact us|/contact]] within [Insert reporting window] of delivery with your order number and photographs of the saree and its packaging, and we will help you resolve it.' }]],
    ] },
    { title: 'Products & Saree Details', items: [
      ['Does the saree come with a blouse piece?', [{ p: 'Where a blouse piece is included, it is listed in the product details. [Insert the standard blouse piece policy, e.g. included, attached or sold separately].' }]],
      ['How long is each saree?', [{ p: 'Length is listed in the product details where we have it. [Insert standard saree length and blouse piece length].' }]],
      ['Will the colour look exactly like the photographs?', [{ p: 'We photograph each saree to show its colour as faithfully as we can, but colours can look slightly different depending on your screen settings and the light you view them in.' }]],
      ['Are your sarees handwoven or hand-printed?', [{ p: 'The fabric, weave and technique of each saree are listed on its product page. [Confirm which sarees are handwoven, hand-printed or machine-made]. [Confirm whether small irregularities that come from handcraft should be described here].' }]],
      ['Do you offer fall, pico or blouse stitching?', [{ p: '[Insert whether fall and pico finishing or blouse stitching is offered, the charges and the extra time needed].' }]],
    ] },
    { title: 'Saree Care', items: [
      ['How should I clean my saree?', [{ p: 'Always follow the care label that comes with your saree. Our [[Saree Care Guide|/care]] has general advice by fabric.' }]],
      ['How should I store silk sarees?', [{ p: 'Store silk folded in a breathable cotton or muslin cover, away from direct sunlight and damp, and refold it every few months so the creases don’t set. More in the [[Saree Care Guide|/care#storage]].' }]],
    ] },
    { title: 'Account & Support', items: [
      ['Do I need an account to place an order?', [{ p: '[Insert whether guest checkout is available and what an account offers].' }]],
      ['How do I save sarees for later?', [{ p: 'Tap the heart on any saree in the collection to keep it in your [[Wishlist|/wishlist]]. The wishlist is saved on the device and browser you used.' }]],
      ['How can I contact you?', [{ p: 'Use the form on our [[Contact page|/contact]], or email [Insert support email]. We reply during [Insert support hours].' }]],
    ] },
  ],
};

/* ─── Shipping & Delivery ─────────────────────────────────── */
export const shipping = {
  slug: 'shipping',
  eyebrow: 'Help',
  title: 'Shipping & Delivery',
  description: 'How Stylish Naari processes, ships and delivers orders, how to track an order, and what to do if a delivery is delayed.',
  intro: 'Everything you need to know about how your order is prepared, sent and delivered. If anything here doesn’t answer your question, [[contact us|/contact]].',
  sections: [
    { id: 'processing', title: 'Order processing', body: [
      { p: 'Orders are processed within [Insert processing time] of being placed, excluding [Insert non-working days, e.g. Sundays and public holidays].' },
      { p: '[Insert whether made-to-order, customised or pre-order items need longer, and how long].' },
    ] },
    { id: 'destinations', title: 'Where we ship', body: [
      { p: 'We currently ship to [Insert shipping destinations].' },
      { p: '[Insert whether international shipping is available. If it is, insert the countries, charges, and who pays any customs duties and taxes].' },
    ] },
    { id: 'timelines', title: 'Estimated delivery times', body: [
      { p: 'Once dispatched, orders usually arrive within:' },
      { ul: ['[Insert region, e.g. metro cities]: [Insert delivery estimate]', '[Insert region, e.g. rest of India]: [Insert delivery estimate]'] },
      { p: 'These are estimates, not guaranteed dates. Delivery can take longer during festivals, sales and bad weather, or for remote locations.' },
    ] },
    { id: 'charges', title: 'Shipping charges', body: [
      { p: '[Insert shipping charges].' },
      { p: '[Insert free-shipping eligibility, e.g. the minimum order value, or delete this line if it does not apply].' },
      { p: 'The final shipping charge is always shown at checkout before you pay.' },
    ] },
    { id: 'tracking', title: 'Tracking your order', body: [
      { p: 'When your order is dispatched, [Insert how tracking details are shared, e.g. an email or SMS with a tracking link]. Tracking information can take up to [Insert time] to appear after dispatch.' },
      { p: 'If your tracking hasn’t updated for [Insert number] days, [[contact us|/contact]] with your order number.' },
    ] },
    { id: 'delays', title: 'Delayed, unsuccessful or undelivered shipments', body: [
      { p: 'If your order is taking longer than the estimate above, please [[contact us|/contact]] and we will check with [Insert courier partner, or “our delivery partner”].' },
      { p: '[Insert what happens after an unsuccessful delivery attempt: how many attempts are made, and whether the parcel is returned to us].' },
      { p: '[Insert whether re-shipping a returned parcel is charged, and how much].' },
      { p: 'If your parcel arrives open, damaged or tampered with, please photograph it before opening and [[contact us|/contact]] within [Insert reporting window].' },
    ] },
    { id: 'address', title: 'Incorrect shipping address', body: [
      { p: 'Please check your shipping address carefully before you place your order.' },
      { p: 'If you notice a mistake, [[contact us|/contact]] as soon as possible. We can update the address [Insert until when, e.g. before the order is dispatched]. Once an order has been dispatched we may not be able to redirect it.' },
      { p: '[Insert who is responsible for the cost of re-delivery when an incorrect address was given].' },
    ] },
  ],
};

/* ─── Returns & Exchanges ─────────────────────────────────── */
export const returns = {
  slug: 'returns',
  eyebrow: 'Help',
  title: 'Returns & Exchanges',
  description: 'The Stylish Naari returns and exchanges policy: eligibility, how to request a return, refunds, exchanges and cancellations.',
  intro: 'We want you to love your saree. If something isn’t right, this page explains what can be returned or exchanged and how. [Insert a one-line summary of the policy once confirmed].',
  sections: [
    { id: 'eligibility', title: 'Return eligibility', body: [
      { p: '[Insert return eligibility]. Typical conditions to confirm or remove:' },
      { ul: [
        '[Confirm: the saree must be unused, unwashed and unaltered]',
        '[Confirm: all original tags, packaging and any blouse piece must be returned with it]',
        '[Confirm: the blouse piece must be uncut]',
      ] },
    ] },
    { id: 'ineligible', title: 'Items that may not be returnable', body: [
      { p: '[Insert which items cannot be returned. Questions for the client:]' },
      { ul: [
        '[Confirm: customised items, e.g. sarees with fall and pico done or blouses stitched to order]',
        '[Confirm: products bought in a sale or with a discount code]',
        '[Confirm: sarees that have been worn, washed, altered or dry-cleaned]',
        '[Confirm: gift cards, accessories or any other categories]',
      ] },
    ] },
    { id: 'window', title: 'Return and exchange window', body: [
      { p: 'Return or exchange requests must be made within [Insert number] days of delivery. [Insert when the returned saree must reach us after the request is approved].' },
    ] },
    { id: 'process', title: 'How to request a return', body: [
      { ol: [
        '[[Contact us|/contact]] with your order number, the saree you would like to return and the reason. [Insert whether photographs are required].',
        'We will confirm whether your return is eligible and send you the next steps within [Insert response time].',
        '[Insert how the saree is sent back: a pickup we arrange, or a courier you book. Insert who pays the return shipping].',
        'Pack the saree securely in its original packaging with all tags and the blouse piece.',
        'Once it reaches us and has been checked, we will process your refund or exchange.',
      ] },
    ] },
    { id: 'damaged', title: 'Damaged, defective or incorrect items', body: [
      { p: 'If your saree arrives damaged or defective, or isn’t the one you ordered, please [[contact us|/contact]] within [Insert reporting window] of delivery with your order number and clear photographs of the saree and its packaging.' },
      { p: '[Insert how these cases are resolved, e.g. replacement, exchange or refund, and that return shipping is covered].' },
    ] },
    { id: 'refunds', title: 'Refunds', body: [
      { p: 'Approved refunds are processed within [Insert refund processing time] of the returned saree being received and checked.' },
      { p: 'Refunds are made to [Insert refund method, e.g. the original payment method or store credit]. Your bank or payment provider may take [Insert time] more to show it.' },
      { p: '[Insert whether original shipping charges, cash-on-delivery fees or return shipping costs are deducted from the refund].' },
    ] },
    { id: 'exchanges', title: 'Exchanges', body: [
      { p: '[Insert whether exchanges are offered, e.g. for another saree of the same or higher value, and how any difference in price is handled].' },
      { p: 'Because many of our sarees are made in small numbers, an exchange depends on the saree you would like being available.' },
    ] },
    { id: 'cancellations', title: 'Cancellations', body: [
      { p: '[Insert whether orders can be cancelled, and until when, e.g. before dispatch].' },
      { p: '[Insert how a refund for a cancelled order is made and how long it takes].' },
      { p: '[Insert whether customised orders can be cancelled once work has started].' },
    ] },
    { id: 'help', title: 'Need help?', body: [
      { p: 'For anything about a return, exchange or cancellation, [[contact us|/contact]] with your order number, or email [Insert support email].' },
    ] },
  ],
};

/* ─── Saree Care Guide ────────────────────────────────────── */
export const care = {
  slug: 'care',
  eyebrow: 'Help',
  title: 'Saree Care Guide',
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
      { note: 'General guidance, to be verified by Stylish Naari or a textile expert before publishing. The care label on your saree always comes first.' },
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
  title: 'Get in Touch',
  metaTitle: 'Contact us',
  description: 'Contact Stylish Naari about an order, shipping, returns or any of our sarees.',
  intro: 'Questions about an order, a saree or anything else? Send us a message and we will get back to you as soon as we can.',
  enquiries: ['Order status', 'Shipping', 'Returns & exchanges', 'Product information', 'Other'],
};
