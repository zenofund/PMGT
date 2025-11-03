import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@modules/shared/components/Button";
import { Card, CardContent } from "@modules/shared/components/Card";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
              PM
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              PropertyHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" size="md">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Manage Your Properties
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
            With Ease
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          PropertyHub is the all-in-one platform for modern property managers.
          From tenant management to payment collection, streamline your entire
          business with our intuitive SaaS solution.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/auth/register">
            <Button variant="primary" size="lg" className="text-lg">
              Start Free Trial
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="text-lg">
              Learn More
            </Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Powerful features designed for modern property management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "🏠",
              title: "Property Management",
              description:
                "Manage unlimited properties with detailed information, amenities, and media galleries.",
            },
            {
              icon: "👥",
              title: "Tenant Management",
              description:
                "Keep track of all your tenants, leases, and contacts in one organized system.",
            },
            {
              icon: "💳",
              title: "Payment Collection",
              description:
                "Integrated Paystack payments for seamless rent collection and subscriptions.",
            },
            {
              icon: "🔧",
              title: "Maintenance Tracking",
              description:
                "Submit, track, and resolve maintenance requests efficiently.",
            },
            {
              icon: "📊",
              title: "Advanced Reports",
              description:
                "Generate detailed financial and operational reports with beautiful visualizations.",
            },
            {
              icon: "💬",
              title: "Communication Hub",
              description:
                "Built-in messaging system for seamless communication with tenants.",
            },
          ].map((feature, idx) => (
            <Card key={idx}>
              <CardContent>
                <div className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "$29",
              features: [
                "1 Property",
                "Up to 5 Tenants",
                "Basic Reports",
                "Email Support",
              ],
            },
            {
              name: "Professional",
              price: "$79",
              featured: true,
              features: [
                "Unlimited Properties",
                "Unlimited Tenants",
                "Advanced Reports",
                "Paystack Integration",
                "Priority Support",
              ],
            },
            {
              name: "Enterprise",
              price: "Custom",
              features: [
                "Everything in Professional",
                "API Access",
                "Custom Branding",
                "White Label Options",
                "Dedicated Support",
              ],
            },
          ].map((plan, idx) => (
            <Card
              key={idx}
              className={plan.featured ? "border-blue-500 border-2" : ""}
            >
              <CardContent>
                <div className="pt-6">
                  {plan.featured && (
                    <div className="mb-4 inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 mb-6">
                    {plan.price}
                    <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">
                      /mo
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIdx) => (
                      <li
                        key={featureIdx}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                      >
                        <span className="text-blue-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/register" className="w-full">
                    <Button
                      variant={plan.featured ? "primary" : "outline"}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 border-0">
          <CardContent className="pt-12 pb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-blue-100 mb-8">
              Join hundreds of property managers already using PropertyHub
            </p>
            <Link to="/auth/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start Your Free Trial Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-800 pt-8">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              © 2024 PropertyHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
