<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StartupPitches extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function capital_offer()
    {
        return $this->hasOne(CapitalOffer::class,'id','capital_id');
    }

    public function capital_milestone()
    {
        return $this->hasMany(CapitalMilestone::class,'app_id','id');
    }
}
