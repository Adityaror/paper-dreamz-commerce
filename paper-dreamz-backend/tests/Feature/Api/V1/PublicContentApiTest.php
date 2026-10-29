<?php

namespace Tests\Feature\Api\V1;

use App\Models\CinematicIntro;
use App\Models\Collection;
use App\Models\CraftBanner;
use App\Models\ExperienceItem;
use App\Models\ExperienceSection;
use App\Models\Faq;
use App\Models\FooterLink;
use App\Models\HeroSlide;
use App\Models\NavLink;
use App\Models\NewsletterSubscriber;
use App\Models\PaymentBadge;
use App\Models\ProcessSection;
use App\Models\ProcessStep;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\StorySection;
use App\Models\ValueProp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_active_hero_slides_in_order(): void
    {
        HeroSlide::factory()->create(['sort_order' => 1, 'heading' => 'Second']);
        HeroSlide::factory()->create(['sort_order' => 0, 'heading' => 'First']);
        HeroSlide::factory()->create(['is_active' => false, 'heading' => 'Hidden']);

        $response = $this->getJson('/api/v1/hero-slides');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.heading', 'First');
        $response->assertJsonPath('data.1.heading', 'Second');
    }

    public function test_it_lists_active_collections_in_order(): void
    {
        Collection::factory()->create(['sort_order' => 1, 'name' => 'Second']);
        Collection::factory()->create(['sort_order' => 0, 'name' => 'First']);
        Collection::factory()->create(['is_active' => false, 'name' => 'Hidden']);

        $response = $this->getJson('/api/v1/collections');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.name', 'First');
    }

    public function test_it_shows_a_single_collection_by_slug(): void
    {
        $collection = Collection::factory()->create(['slug' => 'envelopes']);

        $response = $this->getJson('/api/v1/collections/envelopes');

        $response->assertOk();
        $response->assertJsonPath('data.id', $collection->id);
    }

    public function test_it_returns_404_for_an_inactive_collection_slug(): void
    {
        Collection::factory()->create(['slug' => 'hidden', 'is_active' => false]);

        $response = $this->getJson('/api/v1/collections/hidden');

        $response->assertNotFound();
    }

    public function test_it_lists_active_products_and_can_filter_by_collection(): void
    {
        $envelopes = Collection::factory()->create(['slug' => 'envelopes']);
        $keepsakes = Collection::factory()->create(['slug' => 'keepsakes']);

        Product::factory()->create(['collection_id' => $envelopes->id, 'name' => 'Envelope Product']);
        Product::factory()->create(['collection_id' => $keepsakes->id, 'name' => 'Keepsake Product']);
        Product::factory()->create(['is_active' => false, 'name' => 'Hidden Product']);

        $response = $this->getJson('/api/v1/products');
        $response->assertOk();
        $response->assertJsonCount(2, 'data');

        $filtered = $this->getJson('/api/v1/products?collection=envelopes');
        $filtered->assertOk();
        $filtered->assertJsonCount(1, 'data');
        $filtered->assertJsonPath('data.0.name', 'Envelope Product');
    }

    public function test_it_lists_active_faqs_in_order(): void
    {
        Faq::factory()->create(['sort_order' => 1, 'question' => 'Second?']);
        Faq::factory()->create(['sort_order' => 0, 'question' => 'First?']);
        Faq::factory()->create(['is_active' => false, 'question' => 'Hidden?']);

        $response = $this->getJson('/api/v1/faqs');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.question', 'First?');
    }

    public function test_it_subscribes_a_valid_email_to_the_newsletter(): void
    {
        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'bride@example.com',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'bride@example.com',
        ]);
    }

    public function test_it_rejects_an_invalid_email(): void
    {
        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'not-an-email',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('email');
    }

    public function test_resubscribing_the_same_email_does_not_create_a_duplicate(): void
    {
        NewsletterSubscriber::factory()->create(['email' => 'bride@example.com']);

        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'bride@example.com',
        ]);

        $response->assertCreated();
        $this->assertDatabaseCount('newsletter_subscribers', 1);
    }

    public function test_it_shows_the_site_settings(): void
    {
        SiteSetting::factory()->create(['brand_name' => 'Paper Dreamz']);

        $response = $this->getJson('/api/v1/site-settings');

        $response->assertOk();
        $response->assertJsonPath('data.brand_name', 'Paper Dreamz');
    }

    public function test_it_returns_a_default_site_settings_row_when_none_exists(): void
    {
        $response = $this->getJson('/api/v1/site-settings');

        $response->assertOk();
        $this->assertDatabaseCount('site_settings', 1);
    }

    public function test_it_lists_active_nav_links_in_order(): void
    {
        NavLink::factory()->create(['sort_order' => 1, 'label' => 'Second']);
        NavLink::factory()->create(['sort_order' => 0, 'label' => 'First']);
        NavLink::factory()->create(['is_active' => false, 'label' => 'Hidden']);

        $response = $this->getJson('/api/v1/nav-links');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.label', 'First');
        $response->assertJsonPath('data.1.label', 'Second');
    }

    public function test_it_lists_active_footer_links_and_can_filter_by_group(): void
    {
        FooterLink::factory()->create(['group' => 'quick', 'label' => 'Quick One']);
        FooterLink::factory()->create(['group' => 'care', 'label' => 'Care One']);
        FooterLink::factory()->create(['group' => 'quick', 'is_active' => false, 'label' => 'Hidden']);

        $response = $this->getJson('/api/v1/footer-links');
        $response->assertOk();
        $response->assertJsonCount(2, 'data');

        $filtered = $this->getJson('/api/v1/footer-links?group=quick');
        $filtered->assertOk();
        $filtered->assertJsonCount(1, 'data');
        $filtered->assertJsonPath('data.0.label', 'Quick One');
    }

    public function test_it_lists_active_payment_badges_in_order(): void
    {
        PaymentBadge::factory()->create(['sort_order' => 1, 'label' => 'RuPay']);
        PaymentBadge::factory()->create(['sort_order' => 0, 'label' => 'VISA']);
        PaymentBadge::factory()->create(['is_active' => false, 'label' => 'Hidden']);

        $response = $this->getJson('/api/v1/payment-badges');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.label', 'VISA');
    }

    public function test_it_lists_active_value_props_in_order(): void
    {
        ValueProp::factory()->create(['sort_order' => 1, 'title' => 'Second']);
        ValueProp::factory()->create(['sort_order' => 0, 'title' => 'First']);
        ValueProp::factory()->create(['is_active' => false, 'title' => 'Hidden']);

        $response = $this->getJson('/api/v1/value-props');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.title', 'First');
        $response->assertJsonPath('data.1.title', 'Second');
    }

    public function test_it_shows_the_story_section(): void
    {
        StorySection::factory()->create(['heading' => 'Handcrafted with']);

        $response = $this->getJson('/api/v1/story-section');

        $response->assertOk();
        $response->assertJsonPath('data.heading', 'Handcrafted with');
    }

    public function test_it_returns_a_default_story_section_row_when_none_exists(): void
    {
        $response = $this->getJson('/api/v1/story-section');

        $response->assertOk();
        $this->assertDatabaseCount('story_sections', 1);
    }

    public function test_it_shows_the_craft_banner(): void
    {
        CraftBanner::factory()->create(['quote' => 'Every fold is crafted with precision.']);

        $response = $this->getJson('/api/v1/craft-banner');

        $response->assertOk();
        $response->assertJsonPath('data.quote', 'Every fold is crafted with precision.');
    }

    public function test_it_returns_a_default_craft_banner_row_when_none_exists(): void
    {
        $response = $this->getJson('/api/v1/craft-banner');

        $response->assertOk();
        $this->assertDatabaseCount('craft_banners', 1);
    }

    public function test_it_shows_the_experience_section_and_active_items_in_order(): void
    {
        ExperienceSection::factory()->create(['heading' => 'The Experience']);
        ExperienceItem::factory()->create(['sort_order' => 1, 'title' => 'Second']);
        ExperienceItem::factory()->create(['sort_order' => 0, 'title' => 'First']);
        ExperienceItem::factory()->create(['is_active' => false, 'title' => 'Hidden']);

        $response = $this->getJson('/api/v1/experience');

        $response->assertOk();
        $response->assertJsonPath('data.section.heading', 'The Experience');
        $response->assertJsonCount(2, 'data.items');
        $response->assertJsonPath('data.items.0.title', 'First');
        $response->assertJsonPath('data.items.1.title', 'Second');
    }

    public function test_it_returns_a_default_experience_section_row_when_none_exists(): void
    {
        $response = $this->getJson('/api/v1/experience');

        $response->assertOk();
        $this->assertDatabaseCount('experience_sections', 1);
    }

    public function test_it_shows_the_process_section_and_active_steps_in_order(): void
    {
        ProcessSection::factory()->create(['heading' => 'Craftsmanship in Motion']);
        ProcessStep::factory()->create(['sort_order' => 1, 'title' => 'Second', 'highlights' => ['A', 'B']]);
        ProcessStep::factory()->create(['sort_order' => 0, 'title' => 'First', 'highlights' => ['C', 'D']]);
        ProcessStep::factory()->create(['is_active' => false, 'title' => 'Hidden']);

        $response = $this->getJson('/api/v1/process-steps');

        $response->assertOk();
        $response->assertJsonPath('data.section.heading', 'Craftsmanship in Motion');
        $response->assertJsonCount(2, 'data.steps');
        $response->assertJsonPath('data.steps.0.title', 'First');
        $response->assertJsonPath('data.steps.0.highlights', ['C', 'D']);
        $response->assertJsonPath('data.steps.1.title', 'Second');
    }

    public function test_it_returns_a_default_process_section_row_when_none_exists(): void
    {
        $response = $this->getJson('/api/v1/process-steps');

        $response->assertOk();
        $this->assertDatabaseCount('process_sections', 1);
    }

    public function test_it_shows_the_cinematic_intro(): void
    {
        CinematicIntro::factory()->create(['skip_label' => 'Skip Intro']);

        $response = $this->getJson('/api/v1/cinematic-intro');

        $response->assertOk();
        $response->assertJsonPath('data.skip_label', 'Skip Intro');
    }

    public function test_it_returns_a_default_cinematic_intro_row_when_none_exists(): void
    {
        $response = $this->getJson('/api/v1/cinematic-intro');

        $response->assertOk();
        $this->assertDatabaseCount('cinematic_intros', 1);
    }
}
