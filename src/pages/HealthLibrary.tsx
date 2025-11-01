import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Clock, User, TrendingUp } from 'lucide-react';

const healthTopics = [
  {
    title: 'Diabetes Management',
    description: 'Complete guide to managing diabetes effectively',
    readTime: '12 min read',
    author: 'Dr. Sarah Johnson',
    category: 'Chronic Conditions',
    tableOfContents: [
      'What is Diabetes?',
      'Types and Symptoms', 
      'Diet and Lifestyle Changes',
      'Medication Management',
      'Monitoring Blood Sugar',
      'Complications Prevention'
    ]
  },
  {
    title: 'Heart Health Essentials',
    description: 'Understanding cardiovascular health and prevention',
    readTime: '15 min read',
    author: 'Dr. Michael Chen',
    category: 'Cardiology',
    tableOfContents: [
      'What is Heart Disease?',
      'Common Symptoms',
      'Risk Factors and Causes',
      'Prevention Strategies',
      'Treatment Options',
      'Living with Heart Conditions'
    ]
  },
  {
    title: 'Mental Health & Wellness',
    description: 'Guide to maintaining good mental health',
    readTime: '10 min read',
    author: 'Dr. Emily Rodriguez',
    category: 'Mental Health',
    tableOfContents: [
      'What is Mental Health?',
      'Common Mental Health Issues',
      'Signs and Symptoms',
      'Coping Strategies',
      'When to Seek Help',
      'Treatment and Support'
    ]
  },
  {
    title: 'Nutrition & Diet',
    description: 'Essential nutrition information for healthy living',
    readTime: '8 min read',
    author: 'Dr. Lisa Wang',
    category: 'Nutrition',
    tableOfContents: [
      'What is Good Nutrition?',
      'Essential Nutrients',
      'Causes of Poor Nutrition',
      'Healthy Eating Guidelines',
      'Meal Planning Tips',
      'Special Dietary Needs'
    ]
  },
  {
    title: 'Exercise & Fitness',
    description: 'Complete guide to physical fitness and exercise',
    readTime: '14 min read',
    author: 'Dr. James Wilson',
    category: 'Fitness',
    tableOfContents: [
      'What is Physical Fitness?',
      'Benefits of Regular Exercise',
      'Common Exercise Barriers',
      'Creating a Workout Plan',
      'Exercise Safety Tips',
      'Staying Motivated'
    ]
  },
  {
    title: 'Sleep Disorders',
    description: 'Understanding sleep health and common disorders',
    readTime: '11 min read',
    author: 'Dr. Rachel Green',
    category: 'Sleep Medicine',
    tableOfContents: [
      'What is Good Sleep?',
      'Common Sleep Disorders',
      'Symptoms and Causes',
      'Sleep Hygiene Tips',
      'Treatment Options',
      'When to See a Doctor'
    ]
  }
];

const categories = [
  { name: 'Chronic Conditions', count: 25, color: 'bg-primary/10 text-primary' },
  { name: 'Mental Health', count: 18, color: 'bg-secondary/10 text-secondary' },
  { name: 'Nutrition', count: 22, color: 'bg-accent/10 text-accent-dark' },
  { name: 'Cardiology', count: 15, color: 'bg-primary/10 text-primary' },
  { name: 'Fitness', count: 20, color: 'bg-secondary/10 text-secondary' },
  { name: 'Sleep Medicine', count: 12, color: 'bg-accent/10 text-accent-dark' }
];

export default function HealthLibrary() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Library</h1>
              <p className="text-muted-foreground">Explore evidence-based health information and resources</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search health topics..." 
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Explore by Category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${category.color}`}>
                    {category.count} articles
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Health Topics</h2>
            <Button variant="outline" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>View All Topics</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {topic.category}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {topic.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                    {topic.title}
                  </CardTitle>
                  <CardDescription>
                    {topic.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <User className="w-4 h-4 mr-1" />
                    {topic.author}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-3">Table of Contents:</h4>
                    <ul className="space-y-1">
                      {topic.tableOfContents.slice(0, 4).map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                          • {item}
                        </li>
                      ))}
                      {topic.tableOfContents.length > 4 && (
                        <li className="text-sm text-muted-foreground">
                          • And {topic.tableOfContents.length - 4} more...
                        </li>
                      )}
                    </ul>
                  </div>
                  <Button className="w-full bg-gradient-primary">
                    Read Full Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}