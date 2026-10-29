<?php

namespace App\Filament\Widgets;

use App\Filament\Pages;
use App\Filament\Resources;
use Filament\Widgets\Widget;

class QuickLinks extends Widget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 'full';

    protected static string $view = 'filament.widgets.quick-links';

    /**
     * Shortcuts to the screens edited most; everything else is in the sidebar.
     *
     * @return array<string, array<int, array{label: string, icon: string, url: string}>>
     */
    protected function getViewData(): array
    {
        return [
            'groups' => [
                'Pages' => [
                    ['label' => 'Home', 'icon' => 'heroicon-o-home', 'url' => Pages\HomePageContent::getUrl()],
                    ['label' => 'About', 'icon' => 'heroicon-o-book-open', 'url' => Pages\AboutPageContent::getUrl()],
                    ['label' => 'Shop', 'icon' => 'heroicon-o-building-storefront', 'url' => Pages\ShopPageContent::getUrl()],
                    ['label' => 'Gallery', 'icon' => 'heroicon-o-squares-2x2', 'url' => Pages\GalleryPageContent::getUrl()],
                    ['label' => 'Custom Orders', 'icon' => 'heroicon-o-sparkles', 'url' => Pages\CustomOrdersPageContent::getUrl()],
                    ['label' => 'Contact', 'icon' => 'heroicon-o-envelope', 'url' => Pages\ContactPageContent::getUrl()],
                    ['label' => 'FAQ', 'icon' => 'heroicon-o-question-mark-circle', 'url' => Pages\FaqPageContent::getUrl()],
                ],
                'Shop & site' => [
                    ['label' => 'Products', 'icon' => 'heroicon-o-shopping-bag', 'url' => Resources\ProductResource::getUrl()],
                    ['label' => 'Categories', 'icon' => 'heroicon-o-folder', 'url' => Resources\CollectionResource::getUrl()],
                    ['label' => 'Hero Slides', 'icon' => 'heroicon-o-photo', 'url' => Resources\HeroSlideResource::getUrl()],
                    ['label' => 'Promo Popup', 'icon' => 'heroicon-o-megaphone', 'url' => Pages\PromoPopupPage::getUrl()],
                    ['label' => 'Site Settings', 'icon' => 'heroicon-o-cog-6-tooth', 'url' => Pages\SiteSettingsPage::getUrl()],
                ],
            ],
        ];
    }
}
