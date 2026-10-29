<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentBadgeResource;
use App\Models\PaymentBadge;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentBadgeController extends Controller
{
    /**
     * List all active payment badges, ordered for display.
     */
    public function index(): AnonymousResourceCollection
    {
        $badges = PaymentBadge::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return PaymentBadgeResource::collection($badges);
    }
}
