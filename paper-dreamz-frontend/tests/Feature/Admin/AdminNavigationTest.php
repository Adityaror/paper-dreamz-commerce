<?php

namespace Tests\Feature\Admin;

use App\Filament\Resources\CollectionResource\Pages\EditCollection;
use App\Filament\Resources\CollectionResource\RelationManagers\ProductsRelationManager;
use App\Filament\Resources\ProductResource\Pages\CreateProduct;
use App\Filament\Support\WebsitePreview;
use App\Filament\Widgets\LatestEnquiries;
use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\PaperDreamzSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // The panel admits any signed-in user only in the local environment (User doesn't implement FilamentUser).
        config(['app.env' => 'local']);

        $this->seed(PaperDreamzSeeder::class);
        $this->actingAs(User::factory()->create());
    }

    public function test_a_category_lists_the_products_inside_it(): void
    {
        $category = Collection::query()->where('slug', 'wedding-envelopes')->firstOrFail();
        $other = Product::query()->where('collection_id', '!=', $category->id)->orWhereNull('collection_id')->get();

        Livewire::test(ProductsRelationManager::class, ['ownerRecord' => $category, 'pageClass' => EditCollection::class])
            ->assertCanSeeTableRecords($category->products)
            ->assertCanNotSeeTableRecords($other);
    }

    public function test_adding_a_product_from_a_category_preselects_it(): void
    {
        $category = Collection::query()->where('slug', 'wedding-envelopes')->firstOrFail();

        Livewire::withQueryParams(['collection' => $category->id])
            ->test(CreateProduct::class)
            ->assertFormSet(['collection_id' => $category->id]);
    }

    public function test_section_screens_link_to_the_previous_and_next_section_and_preview_it(): void
    {
        $this->get('/admin/story-section-page')
            ->assertOk()
            ->assertSee('Section Text &amp; Photos', false)
            ->assertSee('Craft Banner')
            ->assertSee('admin-preview=story', false);
    }

    public function test_page_content_tabs_preview_their_own_section(): void
    {
        $this->get('/admin/about-page-content')
            ->assertOk()
            ->assertSee('/about?admin-preview=journey', false)
            ->assertSee('/about?admin-preview=page-hero', false);
    }

    public function test_edit_screens_step_between_records_and_preview_the_record(): void
    {
        $products = Product::query()->orderBy('sort_order')->orderBy('id')->get();
        $second = $products[1];

        $this->get('/admin/products/'.$second->id.'/edit')
            ->assertOk()
            ->assertSee('/admin/products/'.$products[0]->id.'/edit', false)
            ->assertSee('/admin/products/'.$products[2]->id.'/edit', false)
            ->assertSee('/shop?admin-preview='.strtolower($second->code).'#'.strtolower($second->code), false);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function screensWithTheirSection(): array
    {
        return [
            'dashboard' => ['/admin', '/?admin-preview=page'],
            'enquiries' => ['/admin/enquiries', '/custom-orders?admin-preview=enquire'],
            'newsletter subscribers' => ['/admin/newsletter-subscribers', '/?admin-preview=newsletter'],
            'categories' => ['/admin/collections', '/shop?admin-preview=page'],
            'new category' => ['/admin/collections/create', '/shop?admin-preview=page'],
            'products' => ['/admin/products', '/shop?admin-preview=page'],
            'new product' => ['/admin/products/create', '/shop?admin-preview=page'],
            'opening video' => ['/admin/cinematic-intro-page', '/?admin-preview=intro'],
            'hero slides' => ['/admin/hero-slides', '/?admin-preview=home'],
            'new hero slide' => ['/admin/hero-slides/create', '/?admin-preview=home'],
            'value strip' => ['/admin/value-props', '/?admin-preview=value-strip'],
            'home sections' => ['/admin/home-page-content', '/?admin-preview=collections'],
            'our story' => ['/admin/story-section-page', '/?admin-preview=story'],
            'craft banner' => ['/admin/craft-banner-page', '/?admin-preview=craft-banner'],
            'testimonials' => ['/admin/testimonials', '/?admin-preview=experience'],
            'testimonials heading' => ['/admin/experience-section-page', '/?admin-preview=experience'],
            'how it is made' => ['/admin/process-section-page', '/?admin-preview=process'],
            'process steps' => ['/admin/process-steps', '/?admin-preview=process'],
            'about' => ['/admin/about-page-content', '/about?admin-preview=page-hero'],
            'shop' => ['/admin/shop-page-content', '/shop?admin-preview=page-hero'],
            'gallery' => ['/admin/gallery-page-content', '/gallery?admin-preview=page-hero'],
            'custom orders' => ['/admin/custom-orders-page-content', '/custom-orders?admin-preview=page-hero'],
            'contact' => ['/admin/contact-page-content', '/contact?admin-preview=page-hero'],
            'faq page' => ['/admin/faq-page-content', '/faq?admin-preview=page-hero'],
            'faq questions' => ['/admin/faqs', '/faq?admin-preview=faq'],
            'policy pages' => ['/admin/policy-pages', '/privacy-policy?admin-preview=page'],
            'site settings' => ['/admin/site-settings-page', '/?admin-preview=site-footer'],
            'header menu' => ['/admin/nav-links', '/?admin-preview=site-header'],
            'footer links' => ['/admin/footer-links', '/?admin-preview=site-footer'],
            'payment badges' => ['/admin/payment-badges', '/?admin-preview=site-footer'],
            'promo popup' => ['/admin/promo-popup-page', '/?admin-preview=promo-popup'],
        ];
    }

    #[DataProvider('screensWithTheirSection')]
    public function test_every_screen_previews_its_own_section_of_the_website(string $screen, string $preview): void
    {
        $this->get($screen)->assertOk()->assertSee(config('app.frontend_url').$preview, false);
    }

    public function test_the_page_preview_button_follows_the_open_tab(): void
    {
        // Each tab's target is in the button's lookup table, keyed by the tab slug Filament puts in ?tab=.
        $this->get('/admin/about-page-content')
            ->assertOk()
            ->assertSee('&quot;slug&quot;:&quot;the-journey&quot;,&quot;url&quot;:&quot;'.config('app.frontend_url').'/about?admin-preview=journey&quot;', false);
    }

    public function test_the_bespoke_block_opens_a_category_that_shows_it(): void
    {
        $category = Collection::query()->whereNull('parent_id')->whereDoesntHave('children')->orderBy('sort_order')->firstOrFail();

        $this->assertSame(
            config('app.frontend_url').'/shop?admin-preview=bespoke#'.$category->slug,
            WebsitePreview::forPageSection('shop.bespoke'),
        );
    }

    public function test_the_dashboard_lists_only_enquiries_still_waiting_for_a_reply(): void
    {
        $waiting = Enquiry::factory()->create(['is_handled' => false]);
        $handled = Enquiry::factory()->create(['is_handled' => true]);

        Livewire::test(LatestEnquiries::class)
            ->assertCanSeeTableRecords([$waiting])
            ->assertCanNotSeeTableRecords([$handled]);
    }
}
