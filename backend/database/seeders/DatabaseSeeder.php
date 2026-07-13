<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            ProfileSeeder::class,
            SkillSeeder::class,
            SocialLinkSeeder::class,
            ProjectSeeder::class,
            BlogPostSeeder::class,
            CertificateSeeder::class,
            CommentSeeder::class,
            ContactMessageSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully.');
    }
}
