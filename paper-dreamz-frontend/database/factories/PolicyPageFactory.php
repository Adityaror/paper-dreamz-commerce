<?php

namespace Database\Factories;

use App\Models\PolicyPage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PolicyPage>
 */
class PolicyPageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(2),
            'title' => fake()->words(3, true),
            'intro' => fake()->sentence(),
            'hero_image' => null,
            'sections' => [
                ['heading' => fake()->words(2, true), 'body' => fake()->paragraph()],
            ],
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
