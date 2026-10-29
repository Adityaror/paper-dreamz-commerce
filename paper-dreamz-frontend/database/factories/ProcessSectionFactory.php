<?php

namespace Database\Factories;

use App\Models\ProcessSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProcessSection>
 */
class ProcessSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'heading' => 'Craftsmanship in Motion',
            'subtext' => 'From initial sketch to heirloom finish—explore the 5-step masterclass behind every Paper Dreamz creation.',
        ];
    }
}
