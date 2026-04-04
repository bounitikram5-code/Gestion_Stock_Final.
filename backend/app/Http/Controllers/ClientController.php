<?php

namespace App\Http\Controllers;
use App\Models\Client;

use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Client::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        \Log::info($request->all());
        $validatedData = $request->validate([
            'nom'       => 'required|string|max:255',
            'telephone' => 'nullable|string',
            'email'     => 'nullable|email',
            'ville'     => 'nullable|string',
        ]);

        $client = Client::create($validatedData);
        return response()->json($client, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        Client::destroy($id);
        return response()->json(['message' => 'Client supprimé']);
    }
}
