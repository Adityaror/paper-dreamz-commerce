<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSetting>
 */
class SiteSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'meta_title' => fake()->company(),
            'meta_description' => fake()->sentence(),
            'meta_keywords' => fake()->words(5, true),
            'og_title' => fake()->company(),
            'og_description' => fake()->sentence(),
            'announcement_text' => fake()->sentence(),
            'logo' => '/images/logo-mark.png',
            'brand_name' => 'Paper Dreamz',
            'brand_tagline' => fake()->words(2, true),
            'footer_blurb' => fake()->paragraph(),
            'footer_est_year' => 2010,
            'footer_copyright_name' => 'Paper Dreamz by Ruchi Mishra',
            'contact_phone' => '+91 99999 80586',
            'contact_email' => fake()->companyEmail(),
            'contact_address' => 'New Delhi, India',
            'instagram_url' => 'https://instagram.com/paperdreamz_ruchi',
            'facebook_url' => 'https://facebook.com',
            'youtube_url' => 'https://youtube.com',
            'whatsapp_url' => 'https://wa.me/919999980586',
        ];
    }
}
