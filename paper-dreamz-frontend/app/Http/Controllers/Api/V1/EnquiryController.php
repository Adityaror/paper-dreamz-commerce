<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreEnquiryRequest;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;

class EnquiryController extends Controller
{
    /**
     * Record a contact / custom-order enquiry so it shows in the admin inbox.
     *
     * The customer is also sent to WhatsApp by the frontend; this is the admin's copy.
     */
    public function store(StoreEnquiryRequest $request): JsonResponse
    {
        $enquiry = Enquiry::query()->create($request->validated());

        return response()->json([
            'message' => 'Enquiry received.',
            'data' => ['id' => $enquiry->id],
        ], 201);
    }
}
