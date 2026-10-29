<?php

namespace App\Http\Resources;

use App\Models\PromoPopup;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PromoPopup
 */
class PromoPopupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = $this->featuredProduct();

        return [
            'is_enabled' => $this->is_enabled,
            'category' => $this->category,
            'eyebrow' => $this->eyebrow,
            'title' => $this->title,
            'message' => $this->message,
            'button_label' => $this->button_label,
            'image' => $this->image,
            'delay_seconds' => $this->delay_seconds,
            // Changes whenever the admin saves, so visitors who dismissed an older popup see the new one.
            'version' => (string) $this->updated_at?->timestamp,
            'product_count' => $this->categoryProductCount(),
            'featured_product' => $product ? [
                'name' => $product->name,
                'image' => $product->image,
                'price' => (float) $product->price,
            ] : null,
        ];
    }
}
