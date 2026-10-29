<?php

namespace App\Filament\Pages;

use App\Filament\Support\PageContentPage;
use Filament\Forms;

class ContactPageContent extends PageContentPage
{
    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationLabel = 'Contact Page';

    protected static ?string $title = 'Contact Page';

    protected static ?int $navigationSort = 6;

    protected function sections(): array
    {
        return [
            'contact.hero' => [
                'label' => 'Header',
                'schema' => static::heroSchema(),
            ],
            'contact.form' => [
                'label' => 'Message Form',
                'schema' => [
                    Forms\Components\TextInput::make('eyebrow')->maxLength(255),
                    Forms\Components\TextInput::make('heading')->maxLength(255),
                    Forms\Components\Textarea::make('intro')->rows(2)->columnSpanFull(),
                    Forms\Components\Placeholder::make('contact_note')
                        ->label('Phone, WhatsApp, email, address & social links')
                        ->content('These come from Settings → Site Settings, so the footer and this page always match.')
                        ->columnSpanFull(),
                ],
            ],
        ];
    }
}
