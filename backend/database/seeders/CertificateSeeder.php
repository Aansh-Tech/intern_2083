<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Certificate;
use App\Models\User;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->error('No user found. Please create an admin user first.');
            return;
        }

        $profileId = $user->profile->id ?? null;

        if (!$profileId) {
            $this->command->error('No profile found for the user.');
            return;
        }

        $certificates = [
            [
                'title' => 'Full Stack Web Development',
                'issuer' => 'freeCodeCamp',
                'issue_date' => '2024-02-10',
                'expiry_date' => null,
                'credential_url' => 'https://freecodecamp.org/certification/example',
                'image' => null,
                'description' => 'Certification covering HTML, CSS, JavaScript, and backend development fundamentals.',
                'display_order' => 1,
            ],
            [
                'title' => 'Laravel Fundamentals',
                'issuer' => 'Laracasts',
                'issue_date' => '2024-06-01',
                'expiry_date' => null,
                'credential_url' => null,
                'image' => null,
                'description' => 'Course covering Laravel routing, Eloquent ORM, authentication, and API development.',
                'display_order' => 2,
            ],
        ];

        foreach ($certificates as $certificate) {
            Certificate::create(array_merge($certificate, ['profile_id' => $profileId]));
        }

        $this->command->info('Created ' . count($certificates) . ' certificates successfully.');
    }
}
