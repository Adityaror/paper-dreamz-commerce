<?php

namespace App\Models;

use Database\Factories\EnquiryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    /** @use HasFactory<EnquiryFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'name',
        'phone',
        'city',
        'product',
        'occasion',
        'quantity',
        'needed_by',
        'message',
        'reference_images',
        'is_handled',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reference_images' => 'integer',
            'is_handled' => 'boolean',
        ];
    }
}
