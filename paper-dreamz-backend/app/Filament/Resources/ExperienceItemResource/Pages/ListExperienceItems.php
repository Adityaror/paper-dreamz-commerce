<?php

namespace App\Filament\Resources\ExperienceItemResource\Pages;

use App\Filament\Resources\ExperienceItemResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListExperienceItems extends ListRecords
{
    protected static string $resource = ExperienceItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
