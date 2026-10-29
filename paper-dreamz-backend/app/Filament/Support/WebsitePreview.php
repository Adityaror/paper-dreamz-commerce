<?php

namespace App\Filament\Support;

use App\Filament\Pages;
use App\Filament\Resources;
use App\Models\Collection;
use App\Models\PolicyPage;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Where each admin screen shows up on the website, for the "Preview" side panel.
 *
 * Preview links open the frontend as `?admin-preview=<element id>`; the frontend (components/AdminPreview.tsx) scrolls
 * to that element and outlines it. "page" previews the page from the top, "intro" plays the opening video.
 */
class WebsitePreview
{
    /**
     * Admin screen => [website path, element id]. Page-content screens preview their open tab instead (see
     * PageContentPage::getHeaderActions()).
     *
     * @var array<class-string, array{0: string, 1: string}>
     */
    protected const SCREENS = [
        Pages\CinematicIntroPage::class => ['/', 'intro'],
        Resources\HeroSlideResource::class => ['/', 'home'],
        Resources\ValuePropResource::class => ['/', 'value-strip'],
        Pages\StorySectionPage::class => ['/', 'story'],
        Pages\CraftBannerPage::class => ['/', 'craft-banner'],
        Resources\TestimonialResource::class => ['/', 'experience'],
        Pages\ExperienceSectionPage::class => ['/', 'experience'],
        Pages\ProcessSectionPage::class => ['/', 'process'],
        Resources\ProcessStepResource::class => ['/', 'process'],
        Resources\FaqResource::class => ['/faq', 'faq'],
        Resources\PolicyPageResource::class => ['/privacy-policy', 'page'],
        Resources\CollectionResource::class => ['/shop', 'page'],
        Resources\ProductResource::class => ['/shop', 'page'],
        Pages\SiteSettingsPage::class => ['/', 'site-footer'],
        Resources\NavLinkResource::class => ['/', 'site-header'],
        Resources\FooterLinkResource::class => ['/', 'site-footer'],
        Resources\PaymentBadgeResource::class => ['/', 'site-footer'],
        Pages\PromoPopupPage::class => ['/', 'promo-popup'],
        Resources\EnquiryResource::class => ['/custom-orders', 'enquire'],
        Resources\NewsletterSubscriberResource::class => ['/', 'newsletter'],
    ];

    /**
     * `page_sections` key => element id, where it isn't the page header.
     *
     * @var array<string, string>
     */
    protected const PAGE_SECTIONS = [
        'home.collections' => 'collections',
        'home.mission-vision' => 'mission-vision',
        'home.why-choose-us' => 'why-choose-us',
        'home.new-arrivals' => 'new-arrivals',
        'home.faq' => 'faq',
        'about.crafts' => 'about-hero',
        'about.story' => 'about-us',
        'about.stats' => 'about-us',
        'about.journey' => 'journey',
        'about.envelopes' => 'envelopes',
        'about.promise' => 'promise',
        'about.world' => 'world',
        'about.happiness' => 'happiness',
        'about.next-chapter' => 'next-chapter',
        'about.personal-note' => 'personal-note',
        'shop.personalise' => 'personalise',
        'custom-orders.options' => 'options',
        'custom-orders.steps' => 'how-it-works',
        'custom-orders.form' => 'enquire',
        'contact.form' => 'contact-form',
        'faq.cta' => 'faq-contact',
    ];

    /**
     * Preview of an admin screen (a page or resource class), or null when it isn't shown on the website.
     */
    public static function forScreen(string $screen): ?string
    {
        if (! isset(static::SCREENS[$screen])) {
            return null;
        }

        [$path, $section] = static::SCREENS[$screen];

        return static::url($path, $section);
    }

    /**
     * Preview of one block of a page-content screen, e.g. "about.journey".
     */
    public static function forPageSection(string $key): string
    {
        // The bespoke block only shows inside a top-level category without sub-categories, opened by its URL hash.
        if ($key === 'shop.bespoke') {
            $category = Collection::query()->whereNull('parent_id')->where('is_active', true)->whereDoesntHave('children')->orderBy('sort_order')->value('slug');

            return static::url('/shop', $category ? 'bespoke' : 'page', $category);
        }

        $page = Str::before($key, '.');

        return static::url(
            $page === 'home' ? '/' : '/'.$page,
            static::PAGE_SECTIONS[$key] ?? (str_ends_with($key, '.hero') ? 'page-hero' : 'page'),
        );
    }

    /**
     * Preview of a single record; the shop opens a category or product from its URL hash.
     */
    public static function forRecord(string $resource, Model $record): ?string
    {
        return match (true) {
            $record instanceof Product && filled($record->code) => static::url('/shop', Str::lower($record->code), Str::lower($record->code)),
            $record instanceof Product && $record->collection !== null => static::forRecord(Resources\CollectionResource::class, $record->collection),
            $record instanceof Collection => static::url('/shop', $record->slug, $record->slug),
            $record instanceof PolicyPage => static::url('/'.$record->slug, 'page'),
            default => static::forScreen($resource),
        };
    }

    public static function url(string $path, string $section, ?string $hash = null): string
    {
        return rtrim(config('app.frontend_url'), '/').$path.'?admin-preview='.urlencode($section).($hash ? '#'.$hash : '');
    }

    /**
     * Alpine expression that opens the preview side panel (see filament.components.website-preview-panel). Unescaped:
     * Blade and Filament escape it when writing it into the click attribute.
     */
    public static function openHandler(string $url, string $title): string
    {
        return '$dispatch(\'pd-preview\', '.json_encode(['url' => $url, 'title' => $title], JSON_UNESCAPED_SLASHES | JSON_HEX_APOS).')';
    }
}
