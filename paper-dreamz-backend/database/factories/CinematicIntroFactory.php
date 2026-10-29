<?php

namespace Database\Factories;

use App\Models\CinematicIntro;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CinematicIntro>
 */
class CinematicIntroFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'video' => '/videos/intro-photos.mp4',
            'poster_image' => '/images/intro-poster.jpg',
            'skip_label' => 'Skip Intro',
        ];
    }
}
