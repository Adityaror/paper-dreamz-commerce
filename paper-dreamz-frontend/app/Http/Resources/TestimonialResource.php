<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * `body` is stored as one text block with paragraphs separated by blank lines.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'highlight' => $this->highlight,
            'body' => array_values(array_filter(preg_split('/\R\s*\R/', trim((string) $this->body)))),
            'sort_order' => $this->sort_order,
        ];
    }
}
