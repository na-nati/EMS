import React from 'react';
import type { JSX } from 'react/jsx-runtime';

// Recreated modules data based on the component's logic
// This data is used to dynamically calculate the prices for each tier.
const modules = [
  { name: 'Dashboard', price: 50 },
  { name: 'Employees', price: 75 },
  { name: 'Attendance', price: 60 },
  { name: 'Payroll', price: 120 },
  { name: 'Leave Management', price: 80 },
  { name: 'Performance', price: 90 },
  { name: 'Recruitment', price: 100 },
  { name: 'Time Tracking', price: 70 },
  { name: 'Onboarding', price: 45 },
  { name: 'Offboarding', price: 35 },
];

// Recreated components for Check and Star icons using inline SVG
// This replaces the need for the lucide-react library.
const Check = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Star = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);


const formatPrice = (price: number) => {
  return `$${price.toLocaleString()}`;
};

const Pricing = () => {
  // Define which modules are included in each tier
  const basicModules = ['Dashboard', 'Employees', 'Attendance'];
  const proModules = ['Dashboard', 'Employees', 'Attendance', 'Payroll', 'Leave Management', 'Performance'];
  const enterpriseModules = modules.map(m => m.name);

  // Calculate prices
  const basicPrice = modules
    .filter(m => basicModules.includes(m.name))
    .reduce((sum, m) => sum + m.price, 0);

  const proPrice = modules
    .filter(m => proModules.includes(m.name))
    .reduce((sum, m) => sum + m.price, 0);

  const enterprisePrice = modules
    .reduce((sum, m) => sum + m.price, 0);

  const pricingTiers = [
    {
      name: 'Basic',
      price: basicPrice,
      description: 'Perfect for small teams getting started',
      modules: basicModules,
      popular: false,
      features: [
        '3 core modules',
        'Up to 50 employees',
        'Basic reporting',
        'Email support',
        'Mobile app access'
      ]
    },
    {
      name: 'Pro',
      price: proPrice,
      description: 'Ideal for growing companies',
      modules: proModules,
      popular: true,
      features: [
        '6 essential modules',
        'Up to 500 employees',
        'Advanced reporting',
        'Priority support',
        'Custom integrations',
        'Advanced analytics'
      ]
    },
    {
      name: 'Enterprise',
      price: Math.floor(enterprisePrice * 0.85), // 15% discount
      originalPrice: enterprisePrice,
      description: 'Complete solution for large organizations',
      modules: enterpriseModules,
      popular: false,
      features: [
        'All 10 modules included',
        'Unlimited employees',
        'Custom reporting',
        '24/7 phone support',
        'Dedicated account manager',
        'On-premise deployment',
        'Custom development'
      ]
    }
  ];

  return (
    <>
      {/* Styles are placed in a style tag for this self-contained component */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root {
          --background: 0 0% 3.9%;
          --foreground: 0 0% 98%;
          --card: 0 0% 6%;
          --card-foreground: 0 0% 98%;
          --popover: 0 0% 6%;
          --popover-foreground: 0 0% 98%;
          --primary: 142 76% 36%;
          --primary-foreground: 0 0% 98%;
          --secondary: 0 0% 14.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 0 0% 14.9%;
          --muted-foreground: 0 0% 65%;
          --accent: 0 0% 14.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 15%;
          --input: 0 0% 15%;
          --ring: 142 76% 36%;
        }
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary { color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .border-border { border-color: hsl(var(--border)); }
        .hover\\:bg-primary\\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
        .hover\\:bg-muted\\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }

        /* Custom hover animation for the pricing cards */
        .card-hover-effect {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        .card-hover-effect:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          border-color: hsl(var(--primary));
        }
        
        /* Hover effect for list items */
        .list-item-hover-effect {
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .list-item-hover-effect:hover {
          background-color: hsl(0 0% 14.9% / 0.3);
          transform: translateX(5px);
        }

        /* Hover effect for the Get Started button */
        .button-hover-effect {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .button-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px hsl(var(--primary));
        }
      `}</style>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <a
              href="/"
              className="absolute top-8 left-8 text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </a>
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your organization. All plans include core features with no hidden fees.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-card rounded-2xl border card-hover-effect ${
                  tier.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                    <p className="mt-2 text-muted-foreground">{tier.description}</p>

                    <div className="mt-6">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold">
                          {formatPrice(tier.price)}
                        </span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      {tier.originalPrice && (
                        <div className="mt-1">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(tier.originalPrice)}/month
                          </span>
                          <span className="text-sm text-primary ml-2 font-medium">
                            Save 15%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors button-hover-effect ${
                        tier.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-card border border-border text-foreground hover:bg-muted/50'
                      }`}
                    >
                      Get Started
                    </button>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wide">
                      Included Modules ({tier.modules.length})
                    </h4>
                    <ul className="mt-4 space-y-2">
                      {tier.modules.slice(0, 6).map((moduleName) => {
                        const module = modules.find(m => m.name === moduleName);
                        return (
                          <li key={moduleName} className="flex items-center text-sm list-item-hover-effect rounded-md p-1">
                            <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {moduleName} {module && `(${formatPrice(module.price)})`}
                            </span>
                          </li>
                        );
                      })}
                      {tier.modules.length > 6 && (
                        <li className="text-sm text-muted-foreground ml-7">
                          + {tier.modules.length - 6} more modules
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wide">
                      Everything in {tier.name}
                    </h4>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm list-item-hover-effect rounded-md p-1">
                          <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold">Can I change plans later?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Is there a free trial?</h3>
                <p className="mt-2 text-muted-foreground">
                  We offer a 14-day free trial for all plans. No credit card required to get started.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
                <p className="mt-2 text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
