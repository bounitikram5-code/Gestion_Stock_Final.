<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    private function log($action, $description = null, $modelId = null)
    {
        $user = auth('sanctum')->user();
        DB::table('activity_logs')->insert([
            'user_id'     => $user?->id,
            'user_name'   => $user?->name ?? 'Système',
            'action'      => $action,
            'model_type'  => 'Client',
            'model_id'    => $modelId,
            'description' => $description,
            'created_at'  => now(),
        ]);
    }

    public function index()
    {
        return response()->json(Client::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'                => 'required|string|max:255',
            'email'              => 'nullable|email|unique:users,email',
            'ville'              => 'nullable|string',
            'telephone'          => 'nullable|string',
            'adresse'            => 'nullable|string',
            'ice'                => 'nullable|string',
            'identifiant_fiscal' => 'nullable|string',
            'rc'                 => 'nullable|string',
            'patente'            => 'nullable|string',
            'logo'               => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password'           => 'nullable|string|min:8',
        ]);

        $client = new Client();
        $client->nom                = $request->nom;
        $client->email              = $request->email;
        $client->ville              = $request->ville;
        $client->telephone          = $request->telephone;
        $client->adresse            = $request->adresse;
        $client->ice                = $request->ice;
        $client->identifiant_fiscal = $request->identifiant_fiscal;
        $client->rc                 = $request->rc;
        $client->patente            = $request->patente;

        if ($request->hasFile('logo')) {
            $client->logo = $request->file('logo')->store('logos', 'public');
        }

        $client->save();

        // Créer compte user client automatiquement
        if ($request->email && $request->password) {
            $user = User::create([
                'name'      => $request->nom,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'role'      => 'client',
                'is_active' => true,
            ]);
            $client->user_id = $user->id;
            $client->save();
        }

        $this->log('Ajout client', "Client ajouté: {$client->nom}", $client->id);

        return response()->json($client, 201);
    }

    public function show($id)
    {
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
            if ($client->logo) Storage::disk('public')->delete($client->logo);
            $validatedData['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $client->update($validatedData);

        $this->log('Modification client', "Client modifié: {$client->nom}", $id);

        return response()->json($client, 200);
    }

    public function destroy(string $id)
    {
        $client = Client::find($id);
        if ($client) {
            if ($client->logo) Storage::disk('public')->delete($client->logo);
            if ($client->user_id) {
                User::find($client->user_id)?->delete();
            }
            $this->log('Suppression client', "Client supprimé: {$client->nom}", $id);
            $client->delete();
        }
        return response()->json(['message' => 'Client supprimé']);
    }

    public function getStockByClient()
    {
        $clients = Client::with('articles')->get();
        return response()->json($clients);
    }

    // Dashboard client — yshuf ghi dyalo
    public function monStock(Request $request)
    {
        $user = $request->user();

        $client = Client::with(['articles', 'mouvements.article'])
                        ->where('user_id', $user->id)
                        ->first();

        if (!$client) {
            return response()->json(['message' => 'Aucun compte client associé'], 404);
        }

        // Log connexion client — katban f historique dyal admin
        DB::table('activity_logs')->insert([
            'user_id'     => $user->id,
            'user_name'   => $user->name,
            'action'      => 'Connexion client',
            'model_type'  => 'Client',
            'model_id'    => $client->id,
            'description' => "Client connecté: {$user->name}",
            'created_at'  => now(),
        ]);

        return response()->json($client);
    }
}
