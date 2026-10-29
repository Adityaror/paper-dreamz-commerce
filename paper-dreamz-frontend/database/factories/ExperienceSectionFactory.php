<?php

namespace Database\Factories;

use App\Models\ExperienceSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExperienceSection>
 */
class ExperienceSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'heading' => 'The Experience',
            'subtext' => 'Bespoke milestone collections curated for your most special memories',
        ];
    }
}
