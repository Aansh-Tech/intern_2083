<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogPost;
use App\Models\User;
use Carbon\Carbon;

class BlogPostSeeder extends Seeder
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

        $posts = [
            [
                'title' => 'Getting Started with Laravel',
                'slug' => 'getting-started-with-laravel',
                'excerpt' => 'Learn the basics of Laravel and build your first application.',
                'content' => '# Getting Started with Laravel

Laravel is a powerful PHP framework for building modern web applications.

## Key Features
- Eloquent ORM
- Blade templating
- Authentication
- Routing

Start building today!',
                'category' => 'Tutorials',
                'tags' => json_encode(['laravel', 'php', 'web']),
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(10),
                'allow_comments' => true,
            ],
            [
                'title' => 'Why I Love React Native',
                'slug' => 'why-i-love-react-native',
                'excerpt' => 'Exploring the benefits of cross-platform mobile development.',
                'content' => '# Why I Love React Native

React Native allows you to build mobile apps for both iOS and Android using a single codebase.

## Benefits
1. Code reuse
2. Fast development
3. Hot reloading
4. Native performance

It is the future of mobile development!',
                'category' => 'Mobile',
                'tags' => json_encode(['reactnative', 'mobile', 'javascript']),
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(5),
                'allow_comments' => true,
            ],
            [
                'title' => 'Database Design Best Practices',
                'slug' => 'database-design-best-practices',
                'excerpt' => 'Learn how to design efficient database schemas.',
                'content' => '# Database Design Best Practices

Good database design is crucial for application performance.

## Key Principles
1. Normalization
2. Proper indexing
3. Foreign key constraints
4. Data types

Follow these principles for scalable applications.',
                'category' => 'Database',
                'tags' => json_encode(['database', 'mysql', 'sql']),
                'status' => 'draft',
                'published_at' => null,
                'allow_comments' => true,
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::create(array_merge($post, ['profile_id' => $profileId]));
        }

        $this->command->info('Created ' . count($posts) . ' blog posts successfully.');
    }
}
