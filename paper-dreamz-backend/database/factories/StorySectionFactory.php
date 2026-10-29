<?php

namespace Database\Factories;

use App\Models\StorySection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StorySection>
 */
class StorySectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'eyebrow' => 'The Story Behind Every Creation',
            'heading' => 'Handcrafted with',
            'accent_word' => 'passion,',
            'body' => fake()->paragraph(),
            'image' => '/images/brand_story_craft.jpg',
            'cta_label' => 'Know Our Story',
            'cta_link' => '/about',
        ];
    }
}
