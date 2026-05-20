<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController; 
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\MouvementController;

// 🟢 1. الـ Routes ديال السلع والموفمون والشركاء
Route::apiResource('articles', ArticleController::class);
Route::apiResource('fournisseurs', FournisseurController::class);

Route::post('mouvements', [MouvementController::class, 'store']);
Route::get('mouvements', [MouvementController::class, 'index']);

// 🟢 2. الـ Routes الخاصة بفلترة الستوك حسب الكليان (خاصهم يسبقو الـ show)
Route::get('/stock-par-client', [ClientController::class, 'getStockByClient']);
Route::get('/clients/{id}/articles', [MouvementController::class, 'getClientArticles']);

// 🚨 3. الـ Route المصلح ديال تفاصيل كليان واحد بـ {id} نيشان
Route::get('/clients/{id}', [ClientController::class, 'show']); 

// 🟢 4. باقي الـ Routes ديال الكليان (بلا الـ show حيت حددناه الفوق)
Route::apiResource('clients', ClientController::class)->except(['show']);