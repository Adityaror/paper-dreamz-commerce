<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class FaqPageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-question-mark-circle';

    protected static ?string $navigationLabel = 'FAQ Page';

    protected static ?string $title = 'FAQ Page';

    protected static ?int $navigationSort = 7;

    protected function sections(): array
    {
        return [
            'faq.hero' => [
                'label' => 'Header',
                'schema' => [
                    ...static::heroSchema(),
                    Forms\Components\Placeholder::make('faq_note')
                        ->label('Questions')
                        ->content('The questions and answers are edited under FAQs.')
                        ->columnSpanFull(),
                ],
            ],
            'faq.cta' => [
                'label' => 'Contact Prompt',
                'schema' => [
                    Forms\Components\TextInput::make('text')->maxLength(255),
                    Forms\Components\TextInput::make('button_label')->maxLength(255),
                ],
            ],
        ];
    }
}
