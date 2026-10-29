<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class HomePageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?string $navigationLabel = 'Section Text & Photos';

    protected static ?string $title = 'Home Page Sections';

    protected static ?string $navigationGroup = 'Home Page';

    protected static ?int $navigationSort = 4;

    protected function sections(): array
    {
        return [
            'home.collections' => [
                'label' => 'Shop by Category',
                'schema' => [
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('subtext')->maxLength(255),
                    Forms\Components\TextInput::make('button_label')->maxLength(255),
                    Forms\Components\Placeholder::make('categories_note')
                        ->label('Categories')
                        ->content('The category cards themselves are edited under Collections.'),
                ],
            ],
            'home.mission-vision' => [
                'label' => 'Mission & Vision',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255)->helperText('e.g. "Mission &".'),
                    Forms\Components\TextInput::make('accent')->maxLength(255)->helperText('Gold script word, e.g. "Vision".'),
                    Forms\Components\Repeater::make('pillars')
                        ->schema([
                            Forms\Components\TextInput::make('eyebrow')->required()->maxLength(255),
                            Forms\Components\TextInput::make('heading')->maxLength(255),
                            Forms\Components\TextInput::make('accent_word')->label('Script word')->maxLength(255),
                            Forms\Components\Textarea::make('body')->rows(4)->columnSpanFull(),
                            Forms\Components\Textarea::make('quote')->rows(2)->columnSpanFull(),
                        ])
                        ->columns(3)
                        ->itemLabel(fn (array $state): ?string => $state['eyebrow'] ?? null)
                        ->collapsible()
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('signature')->maxLength(255),
                    Forms\Components\TextInput::make('tagline')->maxLength(255),
                ],
            ],
            'home.why-choose-us' => [
                'label' => 'Why Choose Us',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('accent')->maxLength(255)->helperText('Gold script line under the heading.'),
                    Forms\Components\Textarea::make('intro')->rows(3)->columnSpanFull(),
                    Forms\Components\TextInput::make('quote')->maxLength(255)->columnSpanFull(),
                    Forms\Components\TextInput::make('cta_label')->label('Button label')->maxLength(255),
                    Forms\Components\TextInput::make('cta_link')->label('Button link')->maxLength(255),
                    Forms\Components\Repeater::make('reasons')
                        ->schema([
                            Forms\Components\TextInput::make('title')->required()->maxLength(255),
                            Forms\Components\Textarea::make('body')->rows(2),
                        ])
                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                        ->collapsible()
                        ->reorderable()
                        ->columnSpanFull(),
                    Forms\Components\Textarea::make('closing_quote')->rows(3)->columnSpanFull(),
                    static::tags('differentiators', 'Chips under the closing quote.'),
                    Forms\Components\TextInput::make('closing_cta_label')->label('Closing button label')->maxLength(255),
                    Forms\Components\TextInput::make('closing_cta_link')->label('Closing button link')->maxLength(255),
                ],
            ],
            'home.new-arrivals' => [
                'label' => 'New Arrivals Tabs',
                'schema' => [
                    Forms\Components\TextInput::make('new_arrivals_label')->maxLength(255),
                    Forms\Components\TextInput::make('new_arrivals_description')->maxLength(255),
                    Forms\Components\TextInput::make('hot_deals_label')->maxLength(255),
                    Forms\Components\TextInput::make('hot_deals_description')->maxLength(255),
                    Forms\Components\TextInput::make('best_sellers_label')->maxLength(255),
                    Forms\Components\TextInput::make('best_sellers_description')->maxLength(255),
                    Forms\Components\TextInput::make('empty_message')
                        ->maxLength(255)
                        ->helperText('Shown when a tab has no products. Choose which products appear in each tab under Products.')
                        ->columnSpanFull(),
                ],
            ],
            'home.faq' => [
                'label' => 'FAQ Section',
                'schema' => [
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\TextInput::make('quote')->maxLength(255),
                    static::image('image', 'Side photo'),
                    Forms\Components\TextInput::make('image_alt')->label('Photo description')->maxLength(255),
                    Forms\Components\TextInput::make('image_eyebrow')->label('Photo label')->maxLength(255),
                    Forms\Components\TextInput::make('image_caption')->label('Photo caption')->maxLength(255),
                    Forms\Components\Placeholder::make('faqs_note')
                        ->label('Questions')
                        ->content('The questions and answers are edited under FAQs.'),
                ],
            ],
        ];
    }
}
