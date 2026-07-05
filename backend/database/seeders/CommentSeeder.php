<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\BlogPost;  // Make sure this line exists

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $firstPost = BlogPost::first();

        if (!$firstPost) {
            $this->command->error('No blog posts found. Please run BlogPostSeeder first.');
            return;
        }

        $comments = [
            [
                'blog_post_id' => $firstPost->id,
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'content' => 'Great article! Very helpful.',
                'status' => 'approved',
            ],
            [
                'blog_post_id' => $firstPost->id,
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'content' => 'Thanks for sharing this information.',
                'status' => 'approved',
            ],
            [
                'blog_post_id' => $firstPost->id,
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'content' => 'I have a question about the authentication part.',
                'status' => 'pending',
            ],
        ];

        foreach ($comments as $comment) {
            Comment::create($comment);
        }

        $this->command->info('Created ' . count($comments) . ' comments successfully.');
    }
}
