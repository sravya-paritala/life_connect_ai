import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Search, ShoppingCart, Star } from 'lucide-react';

const categories = [
  { name: 'Vitamins & Supplements', icon: '💊', description: 'Essential vitamins and nutritional supplements' },
  { name: 'Monsoon Store', icon: '🌧️', description: 'Seasonal health products for monsoon wellness' },
  { name: 'Ayurvedic Care', icon: '🌿', description: 'Traditional Ayurvedic medicines and remedies' },
  { name: 'Sports Nutrition', icon: '💪', description: 'Protein powders and sports supplements' },
  { name: 'Diabetes Essentials', icon: '🩺', description: 'Blood glucose monitors and diabetic care' },
  { name: 'Mobility & Elderly Care', icon: '🦽', description: 'Mobility aids and elderly care products' },
  { name: 'Protein', icon: '🥛', description: 'Protein supplements and meal replacements' },
  { name: 'Personal Care', icon: '🧴', description: 'Personal hygiene and care products' },
  { name: 'Mother and Baby Care', icon: '👶', description: 'Pregnancy and baby care essentials' }
];

const featuredProducts = [
  { name: 'Vitamin D3 Tablets', price: '₹299', rating: 4.5, discount: '20% OFF' },
  { name: 'Immunity Booster Syrup', price: '₹450', rating: 4.8, discount: '15% OFF' },
  { name: 'Blood Pressure Monitor', price: '₹1,299', rating: 4.6, discount: '10% OFF' },
  { name: 'Protein Powder 1kg', price: '₹899', rating: 4.4, discount: '25% OFF' }
];

export default function Pharmacy() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Pill className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pharmacy Section</h1>
              <p className="text-muted-foreground">Your trusted healthcare products store</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search medicines, supplements..." 
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                      {product.discount}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <Button size="sm" className="bg-gradient-primary">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}