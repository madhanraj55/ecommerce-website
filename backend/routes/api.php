<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/orders', [App\Http\Controllers\Api\OrderController::class, 'store']);
