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

    public function business()
    {
        return $this->hasOne(Listing::class,'id','business_id');
    }

    public function grant_milestone()
    {
        return $this->hasMany(GrantMilestone::class,'app_id','id');
    }
}
