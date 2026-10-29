<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class GalleryPageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    protected static ?string $navigationLabel = 'Gallery Page';

    protected static ?string $title = 'Gallery Page';

    protected static ?int $navigationSort = 4;

    protected function sections(): array
    {
        return [
            'gallery.hero' => [
                'label' => 'Header',
                'schema' => [
                    ...static::heroSchema(),
                    Forms\Components\Placeholder::make('gallery_note')
                        ->label('Photos')
                        ->content('The gallery shows every product that has sizes and pack prices — edit them under Products.')
                        ->columnSpanFull(),
                ],
            ],
        ];
    }
}
