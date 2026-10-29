<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HeroSlideResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'eyebrow' => $this->eyebrow,
            'heading' => $this->heading,
            'accent_text' => $this->accent_text,
            'subtext' => $this->subtext,
            'cta_label' => $this->cta_label,
            'cta_link' => $this->cta_link,
            'video' => $this->video,
            'poster_image' => $this->poster_image,
            'sort_order' => $this->sort_order,
        ];
    }
}
