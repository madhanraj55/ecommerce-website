<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->required(),

                TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                FileUpload::make('image')
                    ->image()
                    ->directory('products'),

                TextInput::make('original_price')
                    ->numeric()
                    ->prefix('₹')
                    ->required(),

                TextInput::make('selling_price')
                    ->numeric()
                    ->prefix('₹')
                    ->required(),

                Toggle::make('status')
                    ->default(true),
            ]);
    }
}