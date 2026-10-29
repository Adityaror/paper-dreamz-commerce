<?php

namespace App\Filament\Resources\FooterLinkResource\Pages;

use App\Filament\Resources\FooterLinkResource;
use App\Filament\Support\HasRecordNavigation;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFooterLink extends EditRecord
{
    use HasRecordNavigation;

    protected static string $resource = FooterLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ...$this->recordNavigationActions(),
            Actions\DeleteAction::make(),
        ];
    }
}
