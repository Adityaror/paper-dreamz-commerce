<?php

namespace App\Filament\Resources\PolicyPageResource\Pages;

use App\Filament\Resources\PolicyPageResource;
use App\Filament\Support\HasRecordNavigation;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPolicyPage extends EditRecord
{
    use HasRecordNavigation;

    protected static string $resource = PolicyPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ...$this->recordNavigationActions(),
            Actions\DeleteAction::make(),
        ];
    }
}
