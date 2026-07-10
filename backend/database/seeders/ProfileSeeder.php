<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->error('No user found. Please run AdminSeeder first.');
            return;
        }

        Profile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'bio' => 'Full stack developer specializing in Laravel, React, and building clean, scalable web applications.',
                'title' => 'Full Stack Developer',
                'phone' => '9800000000',
                'resume_path' => null,
                'profile_photo' => null,
                'address' => 'Dharan, Nepal',
            ]
        );

        $this->command->info('Profile created/updated successfully.');
    }
}
