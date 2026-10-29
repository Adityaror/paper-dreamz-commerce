<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CinematicIntroResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'video' => $this->video,
            'mobile_video' => $this->mobile_video,
            'poster_image' => $this->poster_image,
            'skip_label' => $this->skip_label,
        ];
    }
}
