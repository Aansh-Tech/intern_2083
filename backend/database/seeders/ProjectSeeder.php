<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
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

        $projects = [
            [
                'title' => 'Personal Portfolio System',
                'slug' => 'personal-portfolio-system',
                'subtitle' => 'Modern portfolio with blog and admin panel',
                'description' => 'A complete portfolio system with blog, project showcase, and admin dashboard.',
                'content' => 'This is a full-featured portfolio system built with Laravel backend, React frontend, and React Native mobile app. It includes authentication, CRUD operations, and a RESTful API.',
                'technologies' => 'Laravel, React, MySQL, Tailwind CSS',
                'github_link' => 'https://github.com/yourusername/portfolio',
                'live_link' => 'https://yourdomain.com',
                'is_featured' => true,
                'status' => 'published',
                'completed_at' => '2024-01-15',
            ],
            [
                'title' => 'E-Commerce Platform',
                'slug' => 'e-commerce-platform',
                'subtitle' => 'Full-featured online store',
                'description' => 'A complete e-commerce solution with payment processing and inventory management.',
                'content' => 'This platform includes user authentication, product management, shopping cart, payment integration with Stripe, and order tracking. Built with modern web technologies.',
                'technologies' => 'Vue.js, Node.js, MongoDB, Stripe',
                'github_link' => 'https://github.com/yourusername/ecommerce',
                'live_link' => 'https://ecommerce-demo.com',
                'is_featured' => true,
                'status' => 'published',
                'completed_at' => '2024-03-20',
            ],
            [
                'title' => 'Task Management App',
                'slug' => 'task-management-app',
                'subtitle' => 'Collaborative task management tool',
                'description' => 'A team task management application with real-time updates.',
                'content' => 'This project provides task creation, assignment, progress tracking, and team collaboration features. Includes notifications and real-time updates using WebSockets.',
                'technologies' => 'React Native, Firebase, Redux',
                'github_link' => 'https://github.com/yourusername/task-app',
                'live_link' => null,
                'is_featured' => false,
                'status' => 'published',
                'completed_at' => '2024-05-10',
            ],
            [
                'title' => 'Weather Dashboard',
                'slug' => 'weather-dashboard',
                'subtitle' => 'Real-time weather monitoring',
                'description' => 'A weather dashboard that displays current conditions and forecasts.',
                'content' => 'Uses a weather API to display current conditions, 7-day forecast, and interactive maps. Features location search and favorites.',
                'technologies' => 'React, OpenWeatherMap API, Chart.js',
                'github_link' => 'https://github.com/yourusername/weather-dashboard',
                'live_link' => 'https://weather-demo.com',
                'is_featured' => false,
                'status' => 'draft',
                'completed_at' => null,
            ],
        ];

        foreach ($projects as $project) {
            Project::create(array_merge($project, ['profile_id' => $profileId]));
        }

        $this->command->info('Created ' . count($projects) . ' projects successfully.');
    }
}
