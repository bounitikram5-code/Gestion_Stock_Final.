<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController; // T-akdi mn had s-tar
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\MouvementController;
// 1. Route bach t-choufi ga3 l-articles (GET)
Route::get('/articles', [ArticleController::class, 'index']);

// 2. Route bach t-zidi article jdid (POST)
Route::post('/articles', [ArticleController::class, 'store']);
Route::apiResource('articles', ArticleController::class);
Route::apiResource('fournisseurs', FournisseurController::class);
Route::apiResource('clients', ClientController::class);
Route::post('mouvements', [MouvementController::class, 'store']);
Route::get('mouvements', [MouvementController::class, 'index']);