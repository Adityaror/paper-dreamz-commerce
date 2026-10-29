<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EnquiryResource\Pages;
use App\Models\Enquiry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EnquiryResource extends Resource
{
    protected static ?string $model = Enquiry::class;

    protected static ?string $navigationIcon = 'heroicon-o-inbox-arrow-down';

    protected static ?string $pluralModelLabel = 'enquiries';

    protected static ?string $navigationGroup = 'Inbox';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $unhandled = Enquiry::query()->where('is_handled', false)->count();

        return $unhandled > 0 ? (string) $unhandled : null;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    /**
     * Enquiries come from the website's Contact and Custom Orders forms; only "handled" is editable here.
     */
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->options(['contact' => 'Contact form', 'custom' => 'Custom order'])
                            ->disabled(),
                        Forms\Components\TextInput::make('name')->disabled(),
                        Forms\Components\TextInput::make('phone')->disabled(),
                        Forms\Components\TextInput::make('city')->disabled(),
                        Forms\Components\TextInput::make('product')->label('Interested in')->disabled(),
                        Forms\Components\TextInput::make('occasion')->disabled(),
                        Forms\Components\TextInput::make('quantity')->disabled(),
                        Forms\Components\TextInput::make('needed_by')->label('Needed by')->disabled(),
                        Forms\Components\TextInput::make('reference_images')
                            ->label('Reference images')
                            ->helperText('Photos are shared by the customer on WhatsApp, not stored here.')
                            ->disabled(),
                        Forms\Components\Textarea::make('message')
                            ->rows(6)
                            ->disabled()
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Forms\Components\Toggle::make('is_handled')
                    ->label('Handled')
                    ->helperText('Tick once you have replied to this customer.'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime('d M Y, h:i a')
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'custom' ? 'Custom order' : 'Contact'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('product')
                    ->label('Interested in')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('message')
                    ->limit(60)
                    ->toggleable(),
                Tables\Columns\ToggleColumn::make('is_handled')
                    ->label('Handled')
                    ->alignCenter(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_handled')
                    ->label('Handled'),
                Tables\Filters\SelectFilter::make('type')
                    ->options(['contact' => 'Contact form', 'custom' => 'Custom order']),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Open'),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEnquiries::route('/'),
            'edit' => Pages\EditEnquiry::route('/{record}/edit'),
        ];
    }
}
