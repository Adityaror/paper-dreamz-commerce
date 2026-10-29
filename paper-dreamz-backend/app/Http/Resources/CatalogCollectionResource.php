<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatalogCollectionResource extends JsonResource
{
    /**
     * A collection with its active sub-collections and products nested, as the shop page needs them.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...(new CollectionResource($this->resource))->toArray($request),
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'children' => CatalogCollectionResource::collection($this->whenLoaded('children')),
        ];
    }
}
