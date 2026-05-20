<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }

    public function store(Request $request)
    {
        \Log::info($request->all());

        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'ville' => 'nullable|string',
            'telephone' => 'nullable|string',
            'adresse' => 'nullable|string',
            'ice' => 'nullable|string',
            'identifiant_fiscal' => 'nullable|string',
            'rc' => 'nullable|string',
            'patente' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $client = new Client($validatedData);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $client->logo = $path;
        }

        $client->save();

        return response()->json($client, 201);
    }

    /**
     * 🎯 الدالة المصلحة لجلب تفاصيل الكليان والسلع ديالو
     */
    public function show($id)
{
    // Hna ghadi n-jib l-client + l-articles li 3ndo
    $client = Client::with('articles')->find($id); 

    if (!$client) {
        return response()->json(['message' => 'Partenaire introuvable'], 404);
    }
    
    return response()->json($client);
}
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        
        $validatedData = $request->validate([
            'nom'                => 'required|string|max:255',
            'telephone'          => 'required|string',
            'email'              => 'nullable|email',
            'ville'              => 'required|string',
            'adresse'            => 'required|string',
            'ice'                => 'required|string|max:15',
            'identifiant_fiscal' => 'nullable|string',
            'rc'                 => 'nullable|string',
            'patente'            => 'nullable|string',
            'logo'               => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($client->logo) {
                Storage::disk('public')->delete($client->logo);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $validatedData['logo'] = $path;
        }

        $client->update($validatedData);
        
        return response()->json($client, 200);
    }

    public function destroy(string $id)
    {
        $client = Client::find($id);
        if ($client && $client->logo) {
            Storage::disk('public')->delete($client->logo);
        }
        Client::destroy($id);
        return response()->json(['message' => 'Client supprimé']);
    }

   public function getStockByClient() {
    // T-a-k-d b-l-l-i k-t-e-b-t-i articles (m-c-h-i stock)
    $clients = Client::with('articles')->get(); 
    return response()->json($clients);
}
}