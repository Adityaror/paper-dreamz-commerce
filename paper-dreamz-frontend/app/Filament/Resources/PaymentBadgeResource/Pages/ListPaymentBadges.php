<?php

namespace App\Filament\Resources\PaymentBadgeResource\Pages;

use App\Filament\Resources\PaymentBadgeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPaymentBadges extends ListRecords
{
    protected static string $resource = PaymentBadgeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
