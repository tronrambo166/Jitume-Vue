<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class MatchServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('App\Service\MatchScore');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
