<?php

namespace Database\Seeders;

use App\Models\CinematicIntro;
use App\Models\Collection;
use App\Models\CraftBanner;
use App\Models\ExperienceItem;
use App\Models\ExperienceSection;
use App\Models\Faq;
use App\Models\FooterLink;
use App\Models\HeroSlide;
use App\Models\NavLink;
use App\Models\PageSection;
use App\Models\PaymentBadge;
use App\Models\PolicyPage;
use App\Models\ProcessSection;
use App\Models\ProcessStep;
use App\Models\Product;
use App\Models\PromoPopup;
use App\Models\SiteSetting;
use App\Models\StorySection;
use App\Models\Testimonial;
use App\Models\ValueProp;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PaperDreamzSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeds the copy the Next.js frontend shows when the API is unreachable, so the admin starts
     * from exactly what the site looks like. Page copy, testimonials, policies and the shop catalog
     * come from `data/site-content.json`, generated from the frontend by `node scripts/export-content.ts`.
     */
    public function run(): void
    {
        /** @var array{page_sections: array<string, array<string, mixed>>, testimonials_section: array{heading: string, subtext: string}, testimonials: list<array<string, string>>, policies: list<array<string, mixed>>, catalog: list<array<string, mixed>>} $content */
        $content = json_decode(file_get_contents(__DIR__.'/data/site-content.json'), true, flags: JSON_THROW_ON_ERROR);

        HeroSlide::create([
            'eyebrow' => 'Handmade. Luxury. Timeless.',
            'heading' => 'Luxurious creations,',
            'accent_text' => 'beautifully yours.',
            'subtext' => "Luxury handmade envelopes, keepsakes and gifts for life's most beautiful moments.",
            'cta_label' => 'Explore Collection',
            'cta_link' => '#collections',
            'video' => '/videos/hero-v2.mp4',
            'poster_image' => '/images/hero-poster.webp',
            'sort_order' => 0,
            'is_active' => true,
        ]);

        // Shop categories, their shop-page stories and the priced designs (sizes + pack prices) in each.
        foreach ($content['catalog'] as $i => $group) {
            $parent = Collection::create([
                'name' => $group['name'],
                'slug' => $group['slug'],
                'tag' => $group['tag'] ?: null,
                'accent' => $group['accent'] ?? null,
                'description' => $group['description'] ?? null,
                'occasions' => $group['occasions'] ?? [],
                'image' => $group['img'],
                'sort_order' => $i,
                'is_active' => true,
            ]);

            foreach ($group['children'] as $j => $child) {
                $collection = Collection::create([
                    'parent_id' => $parent->id,
                    'name' => $child['name'],
                    'slug' => $child['slug'],
                    'tag' => $child['tag'] ?: null,
                    'image' => $child['img'],
                    'sort_order' => $j,
                    'is_active' => true,
                ]);

                foreach ($child['products'] ?? [] as $k => $product) {
                    $firstPack = $product['sizes'][0]['packs'][0];

                    Product::create([
                        'collection_id' => $collection->id,
                        'code' => $product['code'],
                        'name' => $product['name'],
                        'slug' => Str::slug($product['name']),
                        'badge' => 'New',
                        'tag' => $child['name'],
                        'price' => $firstPack['price'],
                        'unit' => 'Pack of '.$firstPack['qty'],
                        'sizes' => $product['sizes'],
                        'image' => $product['img'],
                        'description' => $product['description'],
                        'is_new_arrival' => true,
                        'sort_order' => $k,
                        'is_active' => true,
                    ]);
                }
            }
        }

        // The original placeholder products, kept for reference but hidden from the site.
        $demoProducts = [
            ['badge' => 'Bestseller', 'tag' => 'Top Picks', 'name' => 'Royal Ivory Filigree Suite', 'price' => 1499, 'unit' => 'Set of 10', 'image' => '/images/collection_envelopes.webp'],
            ['badge' => 'New', 'tag' => 'Heritage Edit', 'name' => 'Emerald Velvet Shagun', 'price' => 1899, 'unit' => 'Set of 10', 'image' => '/images/hero_emerald_envelope.webp'],
            ['badge' => 'Trending', 'tag' => 'Destination Wedding', 'name' => 'Maroon Peacock Sagan', 'price' => 2199, 'unit' => 'Set of 10', 'image' => '/images/new_maroon_peacock.webp'],
            ['badge' => 'Signature', 'tag' => 'Featured', 'name' => 'Anniversary Keepsake Box', 'price' => 2499, 'unit' => 'Piece', 'image' => '/images/k.webp'],
        ];

        foreach ($demoProducts as $i => $product) {
            Product::create([
                'collection_id' => null,
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'badge' => $product['badge'],
                'tag' => $product['tag'],
                'price' => $product['price'],
                'unit' => $product['unit'],
                'image' => $product['image'],
                'is_new_arrival' => in_array($product['badge'], ['New', 'Trending'], true),
                'is_best_seller' => in_array($product['badge'], ['Bestseller', 'Signature'], true),
                'is_hot_deal' => $i === 2,
                'compare_price' => $i === 2 ? $product['price'] + 300 : null,
                'sort_order' => 100 + $i,
                'is_active' => false,
            ]);
        }

        $faqs = [
            [
                'q' => 'Are there any options for customisation?',
                'a' => "Yes — every piece is handcrafted to order. Choose your own colors, themes and designs, and we'll tailor each detail to your celebration.",
            ],
            [
                'q' => 'Do you accept bulk orders?',
                'a' => 'Yes. We welcome bulk orders for weddings, celebrations, corporate gifting and special occasions, with pricing crafted around your quantity and design.',
            ],
            [
                'q' => 'Do you deliver across India?',
                'a' => 'Yes, we deliver to every corner of India, from metros to the smallest towns.',
            ],
            [
                'q' => 'What is the processing time for an order?',
                'a' => 'Standard orders are processed within 7 working days. Bulk orders typically take around 3 weeks for processing and dispatch. Timelines may vary slightly with design complexity and quantity.',
            ],
            [
                'q' => 'How do you prefer to get paid?',
                'a' => 'We require 100% advance payment to confirm an order, with production beginning as soon as payment is received.',
            ],
            [
                'q' => 'What occasions do you craft for?',
                'a' => 'Weddings, rokas, engagements, anniversaries, baby showers, baby arrivals, birthdays and festivals such as Diwali, Eid, Christmas and Raksha Bandhan — alongside bespoke corporate gifting.',
            ],
            [
                'q' => 'Can I customize my order to suit my exact needs?',
                'a' => "Absolutely. Share your ideas and inspiration with us on WhatsApp at +91 99999 80586 or email paperdreamz.orders@gmail.com, and we'll bring your vision to life.",
            ],
            [
                'q' => 'Do you accept returns or exchanges?',
                'a' => "As every piece is handmade and customised specifically for you, we're unable to accept returns or exchanges. We recommend reviewing your customisation details carefully before confirming your order.",
            ],
        ];

        foreach ($faqs as $i => $faq) {
            Faq::create([
                'question' => $faq['q'],
                'answer' => $faq['a'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        SiteSetting::query()->firstOrCreate([], [
            'meta_title' => 'Paper Dreamz by Ruchi Mishra | Luxury Handcrafted Envelopes & Gifting',
            'meta_description' => "Paper Dreamz — luxury handmade envelopes, keepsakes and gifts for life's most beautiful moments. Gold foil, hand-poured wax seals, and heirloom velvet.",
            'meta_keywords' => 'luxury envelopes, floating pearl envelopes, baby envelopes, wedding envelopes, floral envelopes, traditional envelopes, festive envelopes, religious envelopes, gold silver coin envelopes, baby theme coin envelopes, cash boxes, baby theme cash boxes, gold silver coin boxes, luxury tags, greeting cards, custom envelopes, Paper Dreamz',
            'og_title' => 'Paper Dreamz by Ruchi Mishra',
            'og_description' => 'Luxury handcrafted envelopes, keepsakes & bespoke gifting.',
            'announcement_text' => 'Complimentary Shipping On Orders Above ₹2999',
            'logo' => '/images/logo-mark-sm.webp',
            'brand_name' => 'PAPER DREAMZ',
            'brand_tagline' => 'Ruchi Mishra',
            'footer_blurb' => 'Handcrafted with love, curated for special moments. Luxury bespoke envelopes, keepsakes, and heirloom stationery.',
            'footer_est_year' => 2010,
            'footer_copyright_name' => 'Paper Dreamz by Ruchi Mishra',
            'contact_phone' => '9999980586',
            'contact_whatsapp' => '76690 06999',
            'contact_email' => 'Paperdreamz.orders@gmail.com',
            'contact_address' => 'New Delhi, India',
            'business_hours' => '11am to 6pm',
            'instagram_url' => 'https://www.instagram.com/paperdreamz_ruchi?stkn=MWo4aXI3amdoaTN5eg%3D%3D&utm_source=qr',
            'facebook_url' => 'https://www.facebook.com/share/1EEz4maxTH/?mibextid=wwXIfr',
            'youtube_url' => 'https://youtube.com/@paperdreamz2017?si=hM0lk9JFlgQ_2_Kw',
            'pinterest_url' => 'https://pin.it/575TwFYzX',
            'threads_url' => 'https://www.threads.com/@paperdreamz_ruchi',
            'whatsapp_url' => 'https://wa.me/917669006999',
        ]);

        $navLinks = [
            ['label' => 'Home', 'href' => '#home'],
            ['label' => 'Shop', 'href' => '/shop'],
            ['label' => 'Gallery', 'href' => '/gallery'],
            ['label' => 'About', 'href' => '/about'],
            ['label' => 'Custom Orders', 'href' => '/custom-orders'],
            ['label' => 'Contact', 'href' => '/contact'],
        ];

        foreach ($navLinks as $i => $link) {
            NavLink::create([
                'label' => $link['label'],
                'href' => $link['href'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        $quickLinks = [
            ['label' => 'About Us', 'href' => '/about'],
            ['label' => 'Shop All', 'href' => '/shop'],
            ['label' => 'Custom Orders', 'href' => '/custom-orders'],
            ['label' => 'Gallery', 'href' => '/gallery'],
            ['label' => 'Contact Us', 'href' => '/contact'],
        ];

        foreach ($quickLinks as $i => $link) {
            FooterLink::create([
                'group' => 'quick',
                'label' => $link['label'],
                'href' => $link['href'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        $careLinks = [
            ['label' => 'FAQs', 'href' => '/faq'],
            ['label' => 'Shipping & Delivery', 'href' => '/shipping-delivery'],
            ['label' => 'Returns & Refunds', 'href' => '/returns-refunds'],
            ['label' => 'Terms & Conditions', 'href' => '/terms-conditions'],
            ['label' => 'Privacy Policy', 'href' => '/privacy-policy'],
        ];

        foreach ($careLinks as $i => $link) {
            FooterLink::create([
                'group' => 'care',
                'label' => $link['label'],
                'href' => $link['href'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        $paymentBadges = ['VISA', 'Mastercard', 'UPI', 'RuPay'];

        foreach ($paymentBadges as $i => $label) {
            PaymentBadge::create([
                'label' => $label,
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        $valueProps = [
            ['title' => 'Handmade', 'desc' => 'Crafted with love & care'],
            ['title' => 'Custom Orders', 'desc' => 'Personalized for your occasion'],
            ['title' => 'Premium Quality', 'desc' => 'Finest materials, timeless keepsakes'],
            ['title' => 'Safe Delivery', 'desc' => 'Carefully packed, worldwide'],
        ];

        foreach ($valueProps as $i => $valueProp) {
            ValueProp::create([
                'title' => $valueProp['title'],
                'description' => $valueProp['desc'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        StorySection::query()->firstOrCreate([], [
            'eyebrow' => 'The Story Behind Every Creation',
            'heading' => 'Handcrafted',
            'accent_word' => 'passion,',
            'body' => 'Paper Dreamz by Ruchi Mishra is a luxury handmade brand specializing in exquisite envelopes, keepsakes and gifts crafted with passion, precision and love.',
            'image' => '/images/brand_story_craft.webp',
            'cta_label' => 'Know Our Story',
            'cta_link' => '/about',
        ]);

        CraftBanner::query()->firstOrCreate([], [
            'eyebrow' => 'Craftsmanship In Motion',
            'quote' => 'Every fold, petal, and gold emboss is crafted with precision.',
            'background_image' => '/images/cinematic_hero_bg.webp',
        ]);

        PromoPopup::query()->firstOrCreate([], [
            'is_enabled' => true,
            'category' => 'new-arrivals',
            'eyebrow' => 'Just In',
            'title' => 'New Arrivals are here',
            'message' => 'Fresh shagun suites and keepsakes, straight from our atelier.',
            'button_label' => 'Explore Now',
            'delay_seconds' => 3,
        ]);

        CinematicIntro::query()->firstOrCreate([], [
            'video' => '/videos/intro-v2.mp4',
            'mobile_video' => '/videos/intro-mobile-v2.mp4',
            'poster_image' => '/images/intro-poster.webp',
            'skip_label' => 'Skip',
        ]);

        // The "Experience" section shows testimonials; its heading lives on ExperienceSection.
        ExperienceSection::query()->firstOrCreate([], $content['testimonials_section']);

        foreach ($content['testimonials'] as $i => $testimonial) {
            Testimonial::create([...$testimonial, 'sort_order' => $i, 'is_active' => true]);
        }

        $experienceItems = [
            ['title' => 'Weddings', 'tag' => 'Royal Shagun & Invitation Suites', 'image' => '/images/craft_occasion_weddings.webp'],
            ['title' => 'Bulk Orders', 'tag' => 'Destination Celebrations (50-500+ Pcs)', 'image' => '/images/craft_occasion_bulk.webp'],
            ['title' => 'Custom Creations', 'tag' => 'Monogrammed Velvet & Satin Gift Boxes', 'image' => '/images/craft_occasion_custom.webp'],
            ['title' => 'Workshops & DIY', 'tag' => 'Artisanal Delhi Atelier Masterclasses', 'image' => '/images/craft_occasion_workshop.webp'],
        ];

        foreach ($experienceItems as $i => $item) {
            ExperienceItem::create([
                'title' => $item['title'],
                'tag' => $item['tag'],
                'image' => $item['image'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        ProcessSection::query()->firstOrCreate([], [
            'heading' => 'Craftsmanship in Motion',
            'subtext' => 'From initial sketch to heirloom finish—explore the 5-step masterclass behind every Paper Dreamz creation.',
        ]);

        $processSteps = [
            [
                'step_number' => 1,
                'title' => 'Sketch & Monogram',
                'tag' => 'Custom Crest Conception',
                'description' => "Every bespoke suite begins with hand-drawn calligraphy and monogram drafting, tailored to your family's heritage and celebration.",
                'image' => '/images/craft_design_sketch.webp',
                'highlights' => ['Bespoke Monogram Crest', 'Fine Calligraphy Drafting', 'Texture & Tone Matching'],
            ],
            [
                'step_number' => 2,
                'title' => '3D Petal Layering',
                'tag' => 'Precision Tweezers Sculpting',
                'description' => 'Individual floral petals are sculpted, micro-embossed for delicate vein texture, and layered in relief to create a blooming 3D sculpture.',
                'image' => '/images/craft_design_petals.webp',
                'highlights' => ['Dimensional 3D Florals', 'Micro-Embossed Textures', 'Hand-Formed Curves'],
            ],
            [
                'step_number' => 3,
                'title' => 'Pearl Brooch Setting',
                'tag' => 'Hand-Set Cameo & Crystals',
                'description' => "Lustrous freshwater pearl beads, crystals, and vintage cameos are hand-stitched onto velvet and shimmer paper with jeweler's precision.",
                'image' => '/images/craft_design_pearls.webp',
                'highlights' => ['Lustrous Pearl Accents', 'Hand-Set Brooches', 'Heirloom Durability'],
            ],
            [
                'step_number' => 4,
                'title' => 'Mandala Foil Filigree',
                'tag' => 'Laser Lace & Die Stamping',
                'description' => 'Intricate laser-cut lace borders paired with hot foil stamping in matte gold, champagne, and rose copper metallic finishes.',
                'image' => '/images/craft_design_lotus.webp',
                'highlights' => ['Hot Foil Die Stamping', 'Intricate Laser Filigree', 'Rich Metallic Shimmer'],
            ],
            [
                'step_number' => 5,
                'title' => 'Finished Keepsake',
                'tag' => 'Heirloom Masterpiece Suite',
                'description' => 'Meticulous white-glove inspection, French ribbon binding, custom seal wax stamping, and signature luxury gift presentation.',
                'image' => '/images/craft_design_finished.webp',
                'highlights' => ['Archival Packaging', 'Wax Seal Monogram', 'Turnkey Royal Delivery'],
            ],
        ];

        foreach ($processSteps as $i => $step) {
            ProcessStep::create([
                'step_number' => $step['step_number'],
                'title' => $step['title'],
                'tag' => $step['tag'],
                'description' => $step['description'],
                'image' => $step['image'],
                'highlights' => $step['highlights'],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        foreach ($content['policies'] as $i => $policy) {
            PolicyPage::create([...$policy, 'sort_order' => $i, 'is_active' => true]);
        }

        foreach ($content['page_sections'] as $key => $data) {
            PageSection::create(['key' => $key, 'data' => $data]);
        }
    }
}
