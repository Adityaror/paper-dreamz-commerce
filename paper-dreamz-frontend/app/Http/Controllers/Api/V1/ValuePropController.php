<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ValuePropResource;
use App\Models\ValueProp;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ValuePropController extends Controller
{
    /**
     * List all active value props, ordered for display.
     */
    public function index(): AnonymousResourceCollection
    {
        $valueProps = ValueProp::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return ValuePropResource::collection($valueProps);
    }
}
