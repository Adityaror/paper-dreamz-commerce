<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\CollectionResource;
use App\Filament\Resources\EnquiryResource;
use App\Filament\Resources\NewsletterSubscriberResource;
use App\Filament\Resources\ProductResource;
use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\NewsletterSubscriber;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContentStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    protected function getStats(): array
    {
        $subscribersPerDay = collect(range(6, 0))
            ->map(fn (int $daysAgo): int => NewsletterSubscriber::whereDate('subscribed_at', now()->subDays($daysAgo))->count())
            ->all();
        $newThisWeek = array_sum($subscribersPerDay);

        $waiting = Enquiry::where('is_handled', false)->count();
        $enquiriesThisWeek = Enquiry::where('created_at', '>=', now()->subDays(7))->count();

        return [
            Stat::make('Enquiries to reply to', $waiting)
                ->description($enquiriesThisWeek ? "{$enquiriesThisWeek} received this week" : 'None received this week')
                ->color($waiting ? 'warning' : 'success')
                ->icon('heroicon-o-inbox-arrow-down')
                ->url(EnquiryResource::getUrl('index', ['tableFilters' => ['is_handled' => ['value' => '0']]])),
            Stat::make('Products on the website', Product::where('is_active', true)->count())
                ->description(Product::where('is_active', false)->count().' hidden')
                ->icon('heroicon-o-shopping-bag')
                ->url(ProductResource::getUrl()),
            Stat::make('Categories', Collection::where('is_active', true)->count())
                ->description(Collection::whereNull('parent_id')->count().' main · '.Collection::whereNotNull('parent_id')->count().' sub-categories')
                ->icon('heroicon-o-folder')
                ->url(CollectionResource::getUrl()),
            Stat::make('Newsletter subscribers', NewsletterSubscriber::count())
                ->description($newThisWeek ? "+{$newThisWeek} this week" : 'No new sign-ups this week')
                ->descriptionIcon($newThisWeek ? 'heroicon-m-arrow-trending-up' : null)
                ->color($newThisWeek ? 'success' : 'gray')
                ->chart($subscribersPerDay)
                ->icon('heroicon-o-envelope')
                ->url(NewsletterSubscriberResource::getUrl()),
        ];
    }
}
