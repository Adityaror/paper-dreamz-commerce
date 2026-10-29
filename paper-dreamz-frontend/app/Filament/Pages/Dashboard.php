<?php

namespace App\Filament\Pages;

use App\Filament\Support\WebsitePreview;
use Filament\Actions\Action;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getHeading(): string
    {
        return 'Welcome back, '.auth()->user()->name;
    }

    public function getSubheading(): ?string
    {
        return 'Here is what is live on the Paper Dreamz website right now.';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-m-eye')
                ->color('gray')
                ->alpineClickHandler(WebsitePreview::openHandler(WebsitePreview::url('/', 'page'), 'Home page')),
            Action::make('viewWebsite')
                ->label('View website')
                ->icon('heroicon-m-arrow-top-right-on-square')
                ->url(config('app.frontend_url'))
                ->openUrlInNewTab(),
        ];
    }

    public function getColumns(): int|string|array
    {
        return 2;
    }
}
