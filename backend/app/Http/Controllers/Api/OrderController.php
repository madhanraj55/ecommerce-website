<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller {
    public function store(Request $request) {
        $request->validate([
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'cart' => 'required|array',
            'cart.*.product.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'total_amount' => 'required|numeric'
        ]);

        $order = Order::create([
            'customer_name' => $request->customer_name,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'total_amount' => $request->total_amount,
            'status' => 'pending'
        ]);

        foreach ($request->cart as $item) {
            $order->items()->create([
                'product_id' => $item['product']['id'],
                'quantity' => $item['quantity'],
                'price' => $item['product']['selling_price']
            ]);
        }

        return response()->json(['message' => 'Order created successfully!', 'order' => $order], 201);
    }
}
