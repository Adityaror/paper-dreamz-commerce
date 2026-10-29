<?php

namespace App\Filament\Resources\NavLinkResource\Pages;

use App\Filament\Resources\NavLinkResource;
use App\Filament\Support\HasRecordNavigation;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNavLink extends EditRecord
{
    use HasRecordNavigation;

    protected static string $resource = NavLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ...$this->recordNavigationActions(),
            Actions\DeleteAction::make(),
        ];
    }
}
