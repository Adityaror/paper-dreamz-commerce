<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SubscribeNewsletterRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    /**
     * Subscribe an email address to the newsletter.
     *
     * Idempotent: resubscribing an existing email just refreshes its timestamp.
     */
    public function store(SubscribeNewsletterRequest $request): JsonResponse
    {
        $subscriber = NewsletterSubscriber::query()->updateOrCreate(
            ['email' => $request->string('email')->lower()->toString()],
            ['subscribed_at' => now()],
        );

        return response()->json([
            'message' => 'Subscribed successfully.',
            'data' => [
                'id' => $subscriber->id,
                'email' => $subscriber->email,
            ],
        ], 201);
    }
}
