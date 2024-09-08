<?php

namespace App\Jobs;

use App\Task;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class StartTasksJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        Log::info('StartTasksJob çalıştı.');
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Mevcut tarihi alıyoruz
        $currentDate = Carbon::now()->toDateString();

        // Tarihi gelen görevleri başlatmak için sorgu
        Task::where('start_date', '<=', $currentDate)
            ->where('status', 'pending') // 'pending' durumunda olan görevler
            ->update(['status' => 'in_progress']);
    }
}
