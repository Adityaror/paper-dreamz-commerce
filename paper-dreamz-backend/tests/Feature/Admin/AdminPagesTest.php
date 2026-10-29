<?php

namespace Tests\Feature\Admin;

use App\Filament\Pages\AboutPageContent;
use App\Filament\Pages\HomePageContent;
use App\Filament\Resources\CollectionResource\Pages\EditCollection;
use App\Models\Collection;
use App\Models\PageSection;
use App\Models\User;
use Database\Seeders\PaperDreamzSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // The panel admits any signed-in user only in the local environment (User doesn't implement FilamentUser).
        config(['app.env' => 'local']);
    }

    /**
     * @return array<string, array{string}>
     */
    public static function adminUrls(): array
    {
        return [
            'home page content' => ['/admin/home-page-content'],
            'about page content' => ['/admin/about-page-content'],
            'shop page content' => ['/admin/shop-page-content'],
            'gallery page content' => ['/admin/gallery-page-content'],
            'custom orders page content' => ['/admin/custom-orders-page-content'],
            'contact page content' => ['/admin/contact-page-content'],
            'faq page content' => ['/admin/faq-page-content'],
            'testimonials' => ['/admin/testimonials'],
            'policy pages' => ['/admin/policy-pages'],
            'enquiries' => ['/admin/enquiries'],
            'products' => ['/admin/products'],
            'collections' => ['/admin/collections'],
            'site settings' => ['/admin/site-settings-page'],
            'cinematic intro' => ['/admin/cinematic-intro-page'],
            'dashboard' => ['/admin'],
            'hero slides' => ['/admin/hero-slides'],
            'value strip' => ['/admin/value-props'],
            'our story' => ['/admin/story-section-page'],
            'craft banner' => ['/admin/craft-banner-page'],
            'testimonials heading' => ['/admin/experience-section-page'],
            'how it is made' => ['/admin/process-section-page'],
            'process steps' => ['/admin/process-steps'],
            'faq questions' => ['/admin/faqs'],
            'header menu' => ['/admin/nav-links'],
            'footer links' => ['/admin/footer-links'],
            'payment badges' => ['/admin/payment-badges'],
            'promo popup' => ['/admin/promo-popup-page'],
            'newsletter subscribers' => ['/admin/newsletter-subscribers'],
            'edit product' => ['/admin/products/1/edit'],
            'edit category' => ['/admin/collections/1/edit'],
        ];
    }

    #[DataProvider('adminUrls')]
    public function test_admin_screen_renders_with_seeded_content(string $url): void
    {
        $this->seed(PaperDreamzSeeder::class);

        $this->actingAs(User::factory()->create())
            ->get($url)
            ->assertOk();
    }

    public function test_category_and_product_lists_show_the_seeded_website_photos(): void
    {
        $this->seed(PaperDreamzSeeder::class);
        $this->actingAs(User::factory()->create());

        // `width()` on an image column sizes the image itself, so a stray "1%" squashes every thumbnail to nothing.
        $this->get('/admin/collections')->assertOk()->assertSee('frontend-assets/images/collection_envelopes.webp')->assertDontSee('width: 1%', false);
        $this->get('/admin/products')->assertOk()->assertSee('frontend-assets/images/products/wedding-envelopes/we0001.webp')->assertDontSee('width: 1%', false);
    }

    public function test_photo_upload_boxes_preview_seeded_website_photos(): void
    {
        $this->seed(PaperDreamzSeeder::class);
        $this->actingAs(User::factory()->create());

        $component = Livewire::test(EditCollection::class, ['record' => Collection::query()->where('slug', 'wedding-envelopes')->value('id')])
            ->call('getFormUploadedFiles', 'data.image');

        $preview = collect($component->effects['returns'][0])->first();

        $this->assertSame(url('frontend-assets/images/products/wedding-envelopes/we0001.webp'), $preview['url']);
    }

    public function test_saving_a_page_keeps_every_block_and_updates_the_edited_one(): void
    {
        $this->seed(PaperDreamzSeeder::class);
        $this->actingAs(User::factory()->create());

        Livewire::test(HomePageContent::class)
            ->set('data.home_collections.heading', 'Browse by Category')
            ->call('save')
            ->assertHasNoErrors();

        $this->assertSame('Browse by Category', PageSection::dataFor('home.collections')['heading']);
        $this->assertSame('Why Choose', PageSection::dataFor('home.why-choose-us')['heading']);
        $this->assertCount(8, PageSection::dataFor('home.why-choose-us')['reasons']);
    }

    public function test_saving_keeps_seeded_frontend_image_paths(): void
    {
        $this->seed(PaperDreamzSeeder::class);
        $this->actingAs(User::factory()->create());

        Livewire::test(AboutPageContent::class)
            ->call('save')
            ->assertHasNoErrors();

        $this->assertSame('/images/brand_story_craft.webp', PageSection::dataFor('about.hero')['image']);
        $this->assertSame('/images/craft_design_sketch.webp', PageSection::dataFor('about.journey')['steps'][0]['image']);
        $this->assertStringStartsWith(
            'PaperDreamZ began nearly 17 years ago in Delhi, when **Ruchi Mishra** decided',
            PageSection::dataFor('about.story')['paragraphs'][0],
        );
    }
}
