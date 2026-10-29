<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class ShopPageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Shop Page';

    protected static ?string $title = 'Shop Page';

    protected static ?int $navigationSort = 3;

    protected function sections(): array
    {
        return [
            'shop.hero' => [
                'label' => 'Header',
                'schema' => static::heroSchema(),
            ],
            'shop.personalise' => [
                'label' => 'Personalisation Points',
                'schema' => [
                    Forms\Components\Repeater::make('items')
                        ->schema([
                            Forms\Components\TextInput::make('title')->required()->maxLength(255),
                            Forms\Components\TextInput::make('text')->maxLength(255),
                        ])
                        ->columns(2)
                        ->maxItems(4)
                        ->helperText('The four points shown on every category (pen, brush, gem and box icons, in that order).')
                        ->columnSpanFull(),
                ],
            ],
            'shop.bespoke' => [
                'label' => 'Made-to-order Categories',
                'schema' => [
                    Forms\Components\Placeholder::make('bespoke_note')
                        ->label('Where this shows')
                        ->content('On categories with no sub-categories yet (e.g. Luxury Tags, Greeting Cards).')
                        ->columnSpanFull(),
                    Forms\Components\Repeater::make('steps')
                        ->label('How it works')
                        ->schema([
                            Forms\Components\TextInput::make('title')->required()->maxLength(255),
                            Forms\Components\TextInput::make('text')->maxLength(255),
                        ])
                        ->columns(2)
                        ->reorderable()
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('quote')->maxLength(255),
                    Forms\Components\TextInput::make('button_label')->maxLength(255),
                ],
            ],
        ];
    }
}
