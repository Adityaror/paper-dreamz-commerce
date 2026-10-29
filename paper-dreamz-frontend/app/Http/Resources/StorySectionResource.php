<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StorySectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'eyebrow' => $this->eyebrow,
            'heading' => $this->heading,
            'accent_word' => $this->accent_word,
            'body' => $this->body,
            'image' => $this->image,
            'cta_label' => $this->cta_label,
            'cta_link' => $this->cta_link,
        ];
    }
}
