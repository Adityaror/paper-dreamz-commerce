<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PolicyPageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Each section's `body` is stored as one text block with paragraphs separated by blank lines.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'intro' => $this->intro,
            'hero_image' => $this->hero_image,
            'sections' => collect($this->sections ?? [])->map(fn (array $section): array => [
                'heading' => $section['heading'] ?? '',
                'body' => array_values(array_filter(preg_split('/\R\s*\R/', trim((string) ($section['body'] ?? ''))))),
            ])->values()->all(),
            'sort_order' => $this->sort_order,
        ];
    }
}
