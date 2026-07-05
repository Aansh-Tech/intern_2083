<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SocialLink;
use App\Models\User;

class SocialLinkSeeder extends Seeder
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

        $links = [
            [
                'platform' => 'GitHub',
                'url' => 'https://github.com/yourusername',
                'display_order' => 1,
            ],
            [
                'platform' => 'LinkedIn',
                'url' => 'https://linkedin.com/in/yourusername',
                'display_order' => 2,
            ],
            [
                'platform' => 'Twitter',
                'url' => 'https://twitter.com/yourusername',
                'display_order' => 3,
            ],
            [
                'platform' => 'YouTube',
                'url' => 'https://youtube.com/@yourusername',
                'display_order' => 4,
            ],
        ];

        foreach ($links as $link) {
            SocialLink::create(array_merge($link, ['profile_id' => $profileId]));
        }

        $this->command->info('Created ' . count($links) . ' social links successfully.');
    }
}
