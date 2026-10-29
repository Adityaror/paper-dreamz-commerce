<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'code' => $this->code,
            'name' => $this->name,
            'slug' => $this->slug,
            'badge' => $this->badge,
            'tag' => $this->tag,
            'price' => (float) $this->price,
            'compare_price' => $this->compare_price !== null ? (float) $this->compare_price : null,
            'unit' => $this->unit,
            'sizes' => $this->sizes ?? [],
            'image' => $this->image,
            'description' => $this->description,
            'is_new_arrival' => $this->is_new_arrival,
            'is_hot_deal' => $this->is_hot_deal,
            'is_best_seller' => $this->is_best_seller,
            'collection' => $this->whenLoaded('collection', fn () => [
                'id' => $this->collection->id,
                'name' => $this->collection->name,
                'slug' => $this->collection->slug,
            ]),
            'sort_order' => $this->sort_order,
        ];
    }
}
