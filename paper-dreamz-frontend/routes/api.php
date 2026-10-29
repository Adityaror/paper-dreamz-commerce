<?php

use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\CinematicIntroController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\CraftBannerController;
use App\Http\Controllers\Api\V1\EnquiryController;
use App\Http\Controllers\Api\V1\ExperienceController;
use App\Http\Controllers\Api\V1\FaqController;
use App\Http\Controllers\Api\V1\FooterLinkController;
use App\Http\Controllers\Api\V1\HeroSlideController;
use App\Http\Controllers\Api\V1\NavLinkController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\PageSectionController;
use App\Http\Controllers\Api\V1\PaymentBadgeController;
use App\Http\Controllers\Api\V1\PolicyPageController;
use App\Http\Controllers\Api\V1\ProcessStepController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\PromoPopupController;
use App\Http\Controllers\Api\V1\SiteSettingController;
use App\Http\Controllers\Api\V1\StorySectionController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\ValuePropController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/hero-slides', [HeroSlideController::class, 'index']);

    Route::get('/collections', [CollectionController::class, 'index']);
    Route::get('/collections/{slug}', [CollectionController::class, 'show']);
    Route::get('/catalog', [CatalogController::class, 'index']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::get('/faqs', [FaqController::class, 'index']);

    Route::get('/site-settings', [SiteSettingController::class, 'show']);
    Route::get('/nav-links', [NavLinkController::class, 'index']);
    Route::get('/footer-links', [FooterLinkController::class, 'index']);
    Route::get('/payment-badges', [PaymentBadgeController::class, 'index']);

    Route::get('/value-props', [ValuePropController::class, 'index']);
    Route::get('/story-section', [StorySectionController::class, 'show']);
    Route::get('/craft-banner', [CraftBannerController::class, 'show']);

    Route::get('/experience', [ExperienceController::class, 'index']);
    Route::get('/process-steps', [ProcessStepController::class, 'index']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);

    Route::get('/page-sections/{key}', [PageSectionController::class, 'show']);
    Route::get('/policy-pages', [PolicyPageController::class, 'index']);
    Route::get('/policy-pages/{slug}', [PolicyPageController::class, 'show']);

    Route::get('/cinematic-intro', [CinematicIntroController::class, 'show']);
    Route::get('/promo-popup', [PromoPopupController::class, 'show']);

    Route::post('/newsletter/subscribe', [NewsletterController::class, 'store']);
    Route::post('/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:10,1');
});
