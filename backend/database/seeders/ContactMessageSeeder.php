<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Visitor One',
                'email' => 'visitor1@example.com',
                'subject' => 'Portfolio Inquiry',
                'message' => 'I love your portfolio! Can we collaborate on a project?',
                'is_read' => false,
            ],
            [
                'name' => 'Visitor Two',
                'email' => 'visitor2@example.com',
                'subject' => 'Job Opportunity',
                'message' => 'We are hiring developers. Would you be interested?',
                'is_read' => false,
            ],
            [
                'name' => 'Visitor Three',
                'email' => 'visitor3@example.com',
                'subject' => 'Feedback',
                'message' => 'Your blog posts are very informative. Keep writing!',
                'is_read' => true,
                'read_at' => now()->subHours(2),
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }

        $this->command->info('Created ' . count($messages) . ' contact messages successfully.');
    }
}
