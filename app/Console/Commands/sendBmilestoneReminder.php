<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class sendBmilestoneReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:bmilestone_reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        echo 'it works!';
    }
}
