<?php

namespace Database\Factories;

use App\Models\ProcessStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProcessStep>
 */
class ProcessStepFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'step_number' => 1,
            'title' => fake()->words(2, true),
            'tag' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'image' => '/images/craft_design_sketch.jpg',
            'highlights' => [fake()->words(3, true), fake()->words(3, true), fake()->words(3, true)],
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
