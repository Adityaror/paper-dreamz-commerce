<?php

namespace Database\Factories;

use App\Models\HeroSlide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroSlide>
 */
class HeroSlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'eyebrow' => 'Handmade. Luxury. Timeless.',
            'heading' => fake()->sentence(3),
            'accent_text' => fake()->words(2, true),
            'subtext' => fake()->sentence(),
            'cta_label' => 'Explore Collection',
            'cta_link' => '#collections',
            'video' => '/videos/hero-optimized.mp4',
            'poster_image' => '/images/placeholder.jpg',
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
