<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrantApplication extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function grant()
    {
        return $this->hasOne(Grant::class,'id','grant_id');
    }
}
