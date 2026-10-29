<?php

namespace App\Filament\Resources\PaymentBadgeResource\Pages;

use App\Filament\Resources\PaymentBadgeResource;
use App\Filament\Support\HasRecordNavigation;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPaymentBadge extends EditRecord
{
    use HasRecordNavigation;

    protected static string $resource = PaymentBadgeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ...$this->recordNavigationActions(),
            Actions\DeleteAction::make(),
        ];
    }
}
