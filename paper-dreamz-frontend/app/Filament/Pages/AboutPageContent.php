<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class AboutPageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationLabel = 'About Page';

    protected static ?string $title = 'About Page';

    protected static ?int $navigationSort = 2;

    protected function sections(): array
    {
        return [
            'about.hero' => [
                'label' => 'Header',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255)->helperText('Gold script line under the heading.'),
                    Forms\Components\Textarea::make('intro')->rows(3)->columnSpanFull(),
                    Forms\Components\TextInput::make('primary_cta_label')->label('First button')->maxLength(255),
                    Forms\Components\TextInput::make('secondary_cta_label')->label('Second button')->maxLength(255),
                    static::image('image', 'Main photo'),
                    Forms\Components\TextInput::make('image_alt')->label('Main photo description')->maxLength(255),
                    static::image('inset_image', 'Small tilted photo'),
                    Forms\Components\TextInput::make('inset_image_alt')->label('Small photo description')->maxLength(255),
                ],
            ],
            'about.crafts' => [
                'label' => 'Scrolling Strip',
                'schema' => [
                    static::tags('items', 'Words scrolling across the green strip under the header.'),
                ],
            ],
            'about.story' => [
                'label' => 'About Us',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    Forms\Components\Textarea::make('quote')->rows(2)->columnSpanFull(),
                    static::paragraphs('paragraphs', 'Wrap words in **double stars** to make them bold.'),
                    Forms\Components\TextInput::make('closing_text')->label('Closing line')->maxLength(255),
                    Forms\Components\TextInput::make('closing_highlight')->label('Closing line, gold words')->maxLength(255),
                ],
            ],
            'about.stats' => [
                'label' => 'Numbers',
                'schema' => [
                    Forms\Components\Repeater::make('items')
                        ->schema([
                            Forms\Components\TextInput::make('value')->required()->maxLength(50),
                            Forms\Components\TextInput::make('label')->required()->maxLength(255),
                        ])
                        ->columns(2)
                        ->reorderable()
                        ->columnSpanFull(),
                ],
            ],
            'about.journey' => [
                'label' => 'The Journey',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    Forms\Components\Textarea::make('intro')->rows(3)->columnSpanFull(),
                    Forms\Components\Repeater::make('steps')
                        ->schema([
                            Forms\Components\TextInput::make('title')->required()->maxLength(255),
                            Forms\Components\Textarea::make('body')->rows(3),
                            static::image('image', 'Photo'),
                        ])
                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                        ->collapsible()
                        ->reorderable()
                        ->columnSpanFull(),
                ],
            ],
            'about.envelopes' => [
                'label' => 'Our Signature',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('watermark')->label('Large faded background word')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    static::paragraphs(),
                    Forms\Components\Textarea::make('quote')->rows(2)->columnSpanFull(),
                    static::image('image', 'Photo'),
                    Forms\Components\TextInput::make('image_alt')->label('Photo description')->maxLength(255),
                    Forms\Components\TextInput::make('badge_value')->label('Photo badge, large text')->maxLength(255),
                    Forms\Components\TextInput::make('badge_label')->label('Photo badge, small text')->maxLength(255),
                ],
            ],
            'about.promise' => [
                'label' => 'Promise',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    Forms\Components\Textarea::make('intro')->rows(2)->columnSpanFull(),
                    Forms\Components\Repeater::make('steps')
                        ->schema([
                            Forms\Components\TextInput::make('step')->required()->maxLength(255),
                            Forms\Components\TextInput::make('body')->maxLength(255),
                        ])
                        ->columns(2)
                        ->reorderable()
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('values_label')->maxLength(255),
                    static::tags('values'),
                ],
            ],
            'about.world' => [
                'label' => 'World Map',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    Forms\Components\Textarea::make('intro')->rows(3)->columnSpanFull(),
                    Forms\Components\Repeater::make('highlights')
                        ->schema([
                            Forms\Components\TextInput::make('value')->required()->maxLength(50),
                            Forms\Components\TextInput::make('label')->required()->maxLength(255),
                        ])
                        ->columns(2)
                        ->maxItems(3)
                        ->helperText('Three cards under the map (pin, globe and envelope icons, in that order).')
                        ->columnSpanFull(),
                    Forms\Components\Textarea::make('closing_quote')->rows(2)->columnSpanFull(),
                ],
            ],
            'about.happiness' => [
                'label' => 'Client Happiness',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    static::paragraphs(),
                    Forms\Components\TextInput::make('link_label')->maxLength(255),
                ],
            ],
            'about.next-chapter' => [
                'label' => 'Next Chapter',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255),
                    Forms\Components\Textarea::make('body')->rows(3)->columnSpanFull(),
                    Forms\Components\Textarea::make('quote')->label("Founder's quote")->rows(3)->columnSpanFull(),
                    Forms\Components\TextInput::make('quote_name')->maxLength(255),
                    Forms\Components\TextInput::make('quote_role')->maxLength(255),
                    static::image('image', 'Photo'),
                    Forms\Components\TextInput::make('image_alt')->label('Photo description')->maxLength(255),
                ],
            ],
            'about.personal-note' => [
                'label' => 'Personal Note',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\Textarea::make('text')->rows(2)->columnSpanFull(),
                    Forms\Components\TextInput::make('accent')->maxLength(255)->columnSpanFull(),
                    Forms\Components\TextInput::make('signature')->maxLength(255),
                    Forms\Components\TextInput::make('tagline')->maxLength(255),
                    Forms\Components\TextInput::make('primary_cta_label')->label('First button')->maxLength(255),
                    Forms\Components\TextInput::make('secondary_cta_label')->label('Second button')->maxLength(255),
                ],
            ],
        ];
    }
}
