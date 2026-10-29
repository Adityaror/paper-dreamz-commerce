<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\EnquiryResource;
use App\Models\Enquiry;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestEnquiries extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = ['default' => 'full', 'lg' => 1];

    protected static ?string $heading = 'Enquiries to reply to';

    public function table(Table $table): Table
    {
        return $table
            ->query(Enquiry::query()->where('is_handled', false)->latest())
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->weight('semibold')
                    ->description(fn (Enquiry $record): string => $record->type === 'custom' ? 'Custom order' : 'Contact form'),
                Tables\Columns\TextColumn::make('phone')
                    ->copyable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received')
                    ->since()
                    ->dateTimeTooltip('d M Y, h:i A'),
                Tables\Columns\ToggleColumn::make('is_handled')
                    ->label('Handled')
                    ->alignCenter(),
            ])
            ->recordUrl(fn (Enquiry $record): string => EnquiryResource::getUrl('edit', ['record' => $record]))
            ->paginated(false)
            ->modifyQueryUsing(fn ($query) => $query->limit(5))
            ->emptyStateIcon('heroicon-o-check-circle')
            ->emptyStateHeading('All caught up')
            ->emptyStateDescription('New enquiries from the contact and custom-order forms appear here.')
            ->headerActions([
                Tables\Actions\Action::make('viewAll')
                    ->label('View all')
                    ->link()
                    ->url(EnquiryResource::getUrl()),
            ]);
    }
}
