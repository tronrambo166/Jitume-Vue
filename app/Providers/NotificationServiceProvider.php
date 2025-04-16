<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('App\Service\Notification');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
