<?php

namespace App\Filament\Resources\ValuePropResource\Pages;

use App\Filament\Resources\ValuePropResource;
use App\Filament\Support\HasRecordNavigation;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditValueProp extends EditRecord
{
    use HasRecordNavigation;

    protected static string $resource = ValuePropResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ...$this->recordNavigationActions(),
            Actions\DeleteAction::make(),
        ];
    }
}
