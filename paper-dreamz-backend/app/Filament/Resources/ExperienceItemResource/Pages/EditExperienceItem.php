<?php

namespace App\Filament\Resources\ExperienceItemResource\Pages;

use App\Filament\Resources\ExperienceItemResource;
use App\Filament\Support\HasRecordNavigation;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditExperienceItem extends EditRecord
{
    use HasRecordNavigation;

    protected static string $resource = ExperienceItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ...$this->recordNavigationActions(),
            Actions\DeleteAction::make(),
        ];
    }
}
