<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProcessStepResource extends JsonResource
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
            'step_number' => $this->step_number,
            'title' => $this->title,
            'tag' => $this->tag,
            'description' => $this->description,
            'image' => $this->image,
            'highlights' => $this->highlights ?? [],
            'sort_order' => $this->sort_order,
        ];
    }
}
