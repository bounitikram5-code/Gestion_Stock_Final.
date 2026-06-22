<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\MouvementController;
use App\Http\Controllers\AuthController;

// ── PUBLIC (machi khassek token)
Route::post('/login', [AuthController::class, 'login']);

// ── PROTECTED (khassek token)
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Gestion admins — DAKHEL l middleware
    Route::get('/admins',                 [AuthController::class, 'listAdmins']);
    Route::post('/admins',                [AuthController::class, 'createAdmin']);
    Route::patch('/admins/{id}/toggle',   [AuthController::class, 'toggleActive']);
    Route::delete('/admins/{id}',         [AuthController::class, 'deleteAdmin']);
    Route::patch('/admins/{id}/password', [AuthController::class, 'resetPassword']);

    // Articles u Fournisseurs
    Route::apiResource('articles',     ArticleController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);

    // Mouvements
    Route::post('/mouvements', [MouvementController::class, 'store']);
    Route::get('/mouvements',  [MouvementController::class, 'index']);

    // Stock u Clients
    
    Route::get('/stock-par-client',      [ClientController::class,    'getStockByClient']);
    Route::post('/mouvement-stock',      [ClientController::class, 'mouvementStock']);
    Route::get('/clients/{id}/articles', [MouvementController::class, 'getClientArticles']);
    Route::get('/clients/{id}',          [ClientController::class,    'show']);
    Route::get('/mon-stock', [ClientController::class, 'monStock']);
    Route::apiResource('clients',        ClientController::class)->except(['show']);
    Route::get('/activity-logs', function() {
    return response()->json(
        \DB::table('activity_logs')
           ->orderBy('created_at', 'desc')
           ->limit(50)
           ->get()
    );
});
Route::post('/chat', function(\Illuminate\Http\Request $request) {
    $response = \Illuminate\Support\Facades\Http::withHeaders([
        'x-api-key'         => 'sk-ant-...', // ← API key dyalek hna
        'anthropic-version' => '2023-06-01',
        'content-type'      => 'application/json',
    ])->post('https://api.anthropic.com/v1/messages', [
        'model'      => 'claude-sonnet-4-20250514',
        'max_tokens' => 600,
        'system'     => $request->system,
        'messages'   => $request->messages,
    ]);
    
    return response()->json($response->json());
});
});