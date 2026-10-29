<?php

namespace App\Filament\Resources\ValuePropResource\Pages;

use App\Filament\Resources\ValuePropResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListValueProps extends ListRecords
{
    protected static string $resource = ValuePropResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
