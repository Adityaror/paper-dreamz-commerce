<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class CustomOrdersPageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-sparkles';

    protected static ?string $navigationLabel = 'Custom Orders Page';

    protected static ?string $title = 'Custom Orders Page';

    protected static ?int $navigationSort = 5;

    protected function sections(): array
    {
        return [
            'custom-orders.hero' => [
                'label' => 'Header',
                'schema' => static::heroSchema(),
            ],
            'custom-orders.options' => [
                'label' => 'What We Customise',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\Repeater::make('items')
                        ->schema([
                            Forms\Components\TextInput::make('title')->required()->maxLength(255),
                            Forms\Components\TextInput::make('body')->maxLength(255),
                        ])
                        ->columns(2)
                        ->maxItems(6)
                        ->helperText('Up to six cards; each keeps its icon by position.')
                        ->columnSpanFull(),
                ],
            ],
            'custom-orders.steps' => [
                'label' => 'How It Works',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('subtext')->maxLength(255)->columnSpanFull(),
                    Forms\Components\Repeater::make('steps')
                        ->schema([
                            Forms\Components\TextInput::make('step')->label('Number')->required()->maxLength(10),
                            Forms\Components\TextInput::make('title')->required()->maxLength(255),
                            Forms\Components\Textarea::make('body')->rows(2)->columnSpanFull(),
                        ])
                        ->columns(2)
                        ->reorderable()
                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                        ->collapsible()
                        ->columnSpanFull(),
                    static::image('image', 'Photo'),
                    Forms\Components\TextInput::make('image_alt')->label('Photo description')->maxLength(255),
                    Forms\Components\TextInput::make('callout_title')->label('Reference-photo box title')->maxLength(255),
                    Forms\Components\TextInput::make('callout_button')->label('Reference-photo box button')->maxLength(255),
                    Forms\Components\TextInput::make('callout_text')->label('Reference-photo box text')->maxLength(255)->columnSpanFull(),
                ],
            ],
            'custom-orders.form' => [
                'label' => 'Order Form',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('intro')->maxLength(255)->columnSpanFull(),
                    static::tags('occasions', 'Choices in the form\'s Occasion menu. Keep "Other" last — it opens a box for the customer to type their own.'),
                    Forms\Components\Placeholder::make('form_note')
                        ->label('Submissions')
                        ->content('Every enquiry opens WhatsApp for the customer and is also saved under Enquiries.')
                        ->columnSpanFull(),
                ],
            ],
        ];
    }
}
