<?php

use App\Http\Controllers\BlueprintController;
use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // The Architect - Chat Interface
    Route::get('architect', function () {
        return Inertia::render('architect');
    })->name('architect');

    // Chat Session API Routes
    Route::prefix('chat')->group(function () {
        Route::get('sessions', [ChatController::class, 'index'])->name('chat.sessions.index');
        Route::post('sessions', [ChatController::class, 'store'])->name('chat.sessions.store');
        Route::get('sessions/{session}', [ChatController::class, 'show'])->name('chat.sessions.show');
        Route::post('sessions/{session}/messages', [ChatController::class, 'sendMessage'])->name('chat.sessions.message');
        Route::post('sessions/{session}/complete', [ChatController::class, 'complete'])->name('chat.sessions.complete');
    });

    // Blueprint Routes
    Route::get('blueprints', [BlueprintController::class, 'index'])->name('blueprints.index');
    Route::get('blueprints/{blueprint}', [BlueprintController::class, 'show'])->name('blueprints.show');
});

require __DIR__.'/settings.php';
