<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;
use App\Models\User;

class SkillSeeder extends Seeder
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

        $skills = [
            [
                'name' => 'Laravel',
                'category' => 'Backend',
                'proficiency' => 90,
                'display_order' => 1,
            ],
            [
                'name' => 'React.js',
                'category' => 'Frontend',
                'proficiency' => 85,
                'display_order' => 2,
            ],
            [
                'name' => 'PHP',
                'category' => 'Backend',
                'proficiency' => 88,
                'display_order' => 3,
            ],
            [
                'name' => 'MySQL',
                'category' => 'Database',
                'proficiency' => 80,
                'display_order' => 4,
            ],
            [
                'name' => 'JavaScript',
                'category' => 'Frontend',
                'proficiency' => 82,
                'display_order' => 5,
            ],
            [
                'name' => 'Git',
                'category' => 'DevOps',
                'proficiency' => 85,
                'display_order' => 6,
            ],
            [
                'name' => 'Docker',
                'category' => 'DevOps',
                'proficiency' => 70,
                'display_order' => 7,
            ],
            [
                'name' => 'Tailwind CSS',
                'category' => 'Frontend',
                'proficiency' => 78,
                'display_order' => 8,
            ],
        ];

        foreach ($skills as $skill) {
            Skill::create(array_merge($skill, ['profile_id' => $profileId]));
        }

        $this->command->info('Created ' . count($skills) . ' skills successfully.');
    }
}
