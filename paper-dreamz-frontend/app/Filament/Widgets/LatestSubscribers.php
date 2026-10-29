<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestSubscribers extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = ['default' => 'full', 'lg' => 1];

    protected static ?string $heading = 'Latest newsletter sign-ups';

    public function table(Table $table): Table
    {
        return $table
            ->query(NewsletterSubscriber::query()->latest('subscribed_at'))
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->icon('heroicon-m-envelope')
                    ->copyable(),
                Tables\Columns\TextColumn::make('subscribed_at')
                    ->label('Subscribed')
                    ->since()
                    ->dateTimeTooltip('d M Y, h:i A')
                    ->alignEnd(),
            ])
            ->paginated(false)
            ->modifyQueryUsing(fn ($query) => $query->limit(5))
            ->emptyStateIcon('heroicon-o-envelope')
            ->emptyStateHeading('No subscribers yet')
            ->emptyStateDescription('Sign-ups from the website footer form will appear here.')
            ->headerActions([
                Tables\Actions\Action::make('viewAll')
                    ->label('View all')
                    ->link()
                    ->url(NewsletterSubscriberResource::getUrl()),
            ]);
    }
}
