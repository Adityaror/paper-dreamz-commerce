<?php

namespace Tests\Feature\Api\V1;

use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\ExperienceSection;
use App\Models\PageSection;
use App\Models\PolicyPage;
use App\Models\Product;
use App\Models\Testimonial;
use Database\Seeders\PaperDreamzSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_nests_active_sub_collections_and_products_under_top_level_collections(): void
    {
        $envelopes = Collection::factory()->create(['name' => 'Envelopes', 'slug' => 'envelopes', 'occasions' => ['Weddings']]);
        $wedding = Collection::factory()->create(['parent_id' => $envelopes->id, 'slug' => 'wedding-envelopes']);
        Collection::factory()->create(['parent_id' => $envelopes->id, 'is_active' => false]);
        Product::factory()->create([
            'collection_id' => $wedding->id,
            'code' => 'WE0001',
            'sizes' => [['label' => 'Standard', 'packs' => [['qty' => 12, 'price' => 1800]]]],
        ]);
        Product::factory()->create(['collection_id' => $wedding->id, 'is_active' => false]);

        $response = $this->getJson('/api/v1/catalog');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.occasions', ['Weddings']);
        $response->assertJsonCount(1, 'data.0.children');
        $response->assertJsonCount(1, 'data.0.children.0.products');
        $response->assertJsonPath('data.0.children.0.products.0.code', 'WE0001');
        $response->assertJsonPath('data.0.children.0.products.0.sizes.0.packs.0.qty', 12);
    }

    public function test_testimonials_return_the_section_heading_and_split_the_full_note_into_paragraphs(): void
    {
        ExperienceSection::current()->update(['heading' => 'The Experience']);
        Testimonial::factory()->create(['sort_order' => 1, 'name' => 'Second']);
        Testimonial::factory()->create(['sort_order' => 0, 'name' => 'First', 'body' => "One.\n\nTwo."]);
        Testimonial::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/v1/testimonials');

        $response->assertOk();
        $response->assertJsonPath('data.section.heading', 'The Experience');
        $response->assertJsonCount(2, 'data.items');
        $response->assertJsonPath('data.items.0.name', 'First');
        $response->assertJsonPath('data.items.0.body', ['One.', 'Two.']);
    }

    public function test_it_shows_a_page_section_by_key(): void
    {
        PageSection::factory()->create(['key' => 'about.hero', 'data' => ['heading' => 'Our story']]);

        $this->getJson('/api/v1/page-sections/about.hero')
            ->assertOk()
            ->assertJsonPath('data.heading', 'Our story');

        $this->getJson('/api/v1/page-sections/missing.block')->assertNotFound();
    }

    public function test_policy_pages_are_listed_in_order_with_section_paragraphs_split(): void
    {
        PolicyPage::factory()->create(['slug' => 'privacy-policy', 'sort_order' => 1]);
        PolicyPage::factory()->create([
            'slug' => 'shipping-delivery',
            'sort_order' => 0,
            'sections' => [['heading' => 'Delivery', 'body' => "First.\n\nSecond."]],
        ]);
        PolicyPage::factory()->create(['slug' => 'hidden', 'is_active' => false]);

        $this->getJson('/api/v1/policy-pages')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.slug', 'shipping-delivery')
            ->assertJsonPath('data.0.sections.0.body', ['First.', 'Second.']);

        $this->getJson('/api/v1/policy-pages/hidden')->assertNotFound();
    }

    public function test_it_stores_an_enquiry_for_the_admin_inbox(): void
    {
        $response = $this->postJson('/api/v1/enquiries', [
            'type' => 'custom',
            'name' => 'Riya',
            'phone' => '+91 98765 43210',
            'occasion' => 'Wedding / Roka / Engagement',
            'quantity' => '50',
            'reference_images' => 2,
        ]);

        $response->assertCreated();
        $enquiry = Enquiry::sole();
        $this->assertSame('custom', $enquiry->type);
        $this->assertSame(2, $enquiry->reference_images);
        $this->assertFalse($enquiry->is_handled);
    }

    public function test_an_enquiry_needs_a_name_and_a_known_type(): void
    {
        $this->postJson('/api/v1/enquiries', ['type' => 'spam'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type']);

        $this->assertSame(0, Enquiry::count());
    }

    public function test_the_seeder_loads_the_sites_built_in_content(): void
    {
        $this->seed(PaperDreamzSeeder::class);

        $this->getJson('/api/v1/page-sections/home.why-choose-us')
            ->assertOk()
            ->assertJsonPath('data.heading', 'Why Choose');
        $this->getJson('/api/v1/catalog')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'envelopes')
            ->assertJsonPath('data.0.children.0.products.0.code', 'WE0001');
        $this->getJson('/api/v1/products?category=new-arrivals')
            ->assertOk()
            ->assertJsonCount(6, 'data');
        $this->assertSame(4, PolicyPage::count());
        $this->assertSame(8, Testimonial::count());
    }
}
