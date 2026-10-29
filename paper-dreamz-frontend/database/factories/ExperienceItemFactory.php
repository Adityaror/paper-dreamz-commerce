<?php

namespace Database\Factories;

use App\Models\ExperienceItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExperienceItem>
 */
class ExperienceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(2, true),
            'tag' => fake()->sentence(3),
            'image' => '/images/craft_occasion_weddings.jpg',
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
