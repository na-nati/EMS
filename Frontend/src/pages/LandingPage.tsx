import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Building, Zap, Users, Calendar, BarChart3, LayoutDashboard, DollarSign, FileText, ClipboardCheck, GraduationCap, Monitor, CreditCard, Banknote, X } from 'lucide-react';
// Define the type and data for the modules locally to make the app self-contained.
interface Module {
  name: string;
  description: string;
  price: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Data for each module with a price and icon.
const modules: Module[] = [
  { name: 'Dashboard', icon: LayoutDashboard, price: 20, description: 'Overview and analytics for your organization' },
  { name: 'Employees', icon: Users, price: 50, description: 'Complete employee management and profiles' },
  { name: 'Payroll', icon: DollarSign, price: 40, description: 'Automated payroll processing and management' },
  { name: 'Attendance', icon: Calendar, price: 30, description: 'Time tracking and attendance monitoring' },
  { name: 'Leave Management', icon: FileText, price: 25, description: 'Leave requests and approval workflows' },
  { name: 'Performance', icon: ClipboardCheck, price: 35, description: 'Performance reviews and evaluations' },
  { name: 'Training', icon: GraduationCap, price: 30, description: 'Employee training and development programs' },
  { name: 'Assets', icon: Monitor, price: 20, description: 'Asset tracking and management' },
  { name: 'Recruitment', icon: Building, price: 45, description: 'Hiring and recruitment management' },
  { name: 'Reports', icon: BarChart3, price: 50, description: 'Advanced reporting and analytics' }
];

// Payment methods with icons/images for the new design
interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'mobile' | 'bank';
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  image?: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'visa-mastercard', name: 'Visa & Mastercard', type: 'card', icon: CreditCard, description: 'Pay with your international credit or debit card.' },
  { id: 'chapa', name: 'Chapa', type: 'mobile', image: 'https://placehold.co/64x64/000000/000000/png?text=CHAPA', description: 'Pay via Chapa, a local Ethiopian payment gateway.' },
  { id: 'telebirr', name: 'Telebirr', type: 'mobile', image: 'https://placehold.co/64x64/2980b9/ffffff/png?text=T', description: 'Use your Telebirr mobile wallet for a fast payment.' },
  { id: 'local-banks', name: 'Local Ethiopian Banks', type: 'bank', icon: Banknote, description: 'Pay via direct bank transfer from local banks.' },
];

// Helper function to format prices for display.
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

// ModuleCard component for displaying each module.
interface ModuleCardProps {
  module: Module;
  isSelected: boolean;
  onToggle: (moduleName: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, isSelected, onToggle }) => {
  const Icon = module.icon;
  
  return (
    <div
      className={`relative p-6 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'bg-primary border-primary text-primary-foreground shadow-md'
          : 'bg-card border-border text-foreground hover:border-primary/50'
      }`}
      onClick={() => onToggle(module.name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(module.name);
        }
      }}
      aria-pressed={isSelected}
      aria-label={`${module.name} module, ${formatPrice(module.price)} per month`}
    >
      {/* Checkbox indicator */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        isSelected
          ? 'bg-primary-foreground border-primary-foreground'
          : 'border-border'
      }`}>
        {isSelected && <Check className="w-4 h-4 text-primary" />}
      </div>
      
      <div className="flex flex-col items-start space-y-4">
        <div className={`p-3 rounded-lg ${
          isSelected ? 'bg-primary-foreground/10' : 'bg-primary/10'
        }`}>
          <Icon className={`w-6 h-6 ${
            isSelected ? 'text-primary-foreground' : 'text-primary'
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
          <p className={`text-sm mb-4 ${
            isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}>
            {module.description}
          </p>
          <div className="text-2xl font-bold">
            {formatPrice(module.price)}
            <span className="text-sm font-normal opacity-70">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Landing Page Component

// Signup Page Component (now a modal-like view)
const SignupModal: React.FC<{
  onSignup: (name: string, email: string) => void;
  onClose: () => void;
}> = ({ onSignup, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    setError(null);
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      onSignup(name, email);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative p-8 rounded-xl border border-border bg-card/50 backdrop-blur-lg shadow-2xl max-w-xl w-full text-center animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Create Your Account
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start your free trial today.
        </p>

        <form onSubmit={handleSignup} className="space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10  rounded-lg text-center">
              <p className="text-destructive text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Sign Up
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('landing');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const basePrice = 100;

  // Inject the custom CSS into the head of the document
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
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
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleModuleToggle = (moduleName: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const calculateTotal = (): number => {
    return selectedModules.reduce((total, moduleName) => {
      const module = modules.find(m => m.name === moduleName);
      return total + (module?.price || 0);
    }, basePrice);
  };

  const handleSubscribe = async () => {
    if (!companyName.trim()) {
      setError('Please enter your company name');
      return;
    }

    if (selectedModules.length === 0) {
      setError('Please select at least one module');
      return;
    }

    setIsLoading(true);
    setError(null);

    // This section is a simulation for this example.
    setTimeout(() => {
      setIsLoading(false);
      // Upon successful "sign up", move to the payment page
      setCurrentView('payment');
    }, 1500);
  };
  
  const handlePaymentSuccess = () => {
    console.log(`Simulated payment for company: ${companyName.trim()} with total price: ${calculateTotal()}`);
    setCurrentView('success');
  };

  const handleSignupSuccess = (name: string, email: string) => {
    setAdminName(name);
    setAdminEmail(email);
    setShowSignupModal(false);
    setCurrentView('modules');
  };

  const handleRestart = () => {
    setCompanyName('');
    setSelectedModules([]);
    setCurrentView('landing');
  };
  

  const totalPrice = calculateTotal();

  // Landing Page Component
const LandingPage: React.FC<{
  onGetStarted: () => void;
}> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-background font-inter text-foreground flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-4xl mx-auto py-16 md:py-24">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Employee Management System
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our modular Employee Management System helps you manage your team with ease. Choose only the features you need and pay as you grow.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all hover:bg-primary/90 shadow-lg hover:shadow-xl"
        >
          Get Started
          <ArrowRight className="w-5 h-5 inline-block ml-2" />
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Flexible Modules, Tailored for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.slice(0, 6).map((module, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card">
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <module.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  // Landing Page with Module Selection Component
  const LandingWithModulesPage: React.FC<{
    selectedModules: string[];
    companyName: string;
    isLoading: boolean;
    error: string | null;
    handleModuleToggle: (name: string) => void;
    setCompanyName: (name: string) => void;
    handleSubscribe: () => void;
    totalPrice: number;
    adminName: string;
    adminEmail: string;
  }> = ({
    selectedModules,
    companyName,
    isLoading,
    error,
    handleModuleToggle,
    setCompanyName,
    handleSubscribe,
    totalPrice,
    adminName,
  }) => {
    const basePrice = 100;
    return (
      <>
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Welcome, {adminName}!
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the modules you need for your company and get started.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Picking your modules now will set up your personalized system.</span>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:grid lg:grid-cols-3 lg:gap-12">
          <section id="features" className="lg:col-span-2 mb-16 lg:mb-0">
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Modules</h2>
              <p className="text-muted-foreground">Select the features that match your business needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.name}
                  module={module}
                  isSelected={selectedModules.includes(module.name)}
                  onToggle={handleModuleToggle}
                />
              ))}
            </div>
          </section>

          <div className="lg:col-span-1 sticky top-24 h-fit p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Your Subscription</h2>
              <p className="text-sm text-muted-foreground">Tailored to your needs.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Base Platform</span>
                <span>{formatPrice(basePrice)}/mo</span>
              </div>
              
              {selectedModules.map(name => {
                const module = modules.find(m => m.name === name);
                return (
                  <div key={name} className="flex justify-between items-center text-sm">
                    <span className="text-foreground">{module?.name}</span>
                    <span className="text-primary font-medium">{formatPrice(module?.price || 0)}/mo</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-end mb-4">
                <span className="text-lg font-bold">Total:</span>
                <div className="flex flex-col items-end">
                  <p className="text-3xl font-extrabold text-primary transition-all duration-300">
                    {formatPrice(totalPrice)}
                  </p>
                  <span className="text-sm text-muted-foreground">per month</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm text-center">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={selectedModules.length === 0 || !companyName.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </main>
      </>
    );
  };

  // Payment Page Component
  const PaymentPage: React.FC<{ companyName: string; totalPrice: number; onPaymentSuccess: () => void; adminName: string; adminEmail: string; }> = ({ companyName, totalPrice, onPaymentSuccess, adminName, adminEmail }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('visa-mastercard');

    const handlePayment = () => {
      setIsLoading(true);
      setError(null);

      // Simulate payment processing time
      setTimeout(() => {
        setIsLoading(false);
        // Simulate a successful payment
        onPaymentSuccess();
      }, 2000);
    };

    const renderPaymentForm = () => {
      switch (selectedPaymentMethod) {
        case 'visa-mastercard':
          return (
            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                <input type="text" id="cardNumber" placeholder="**** **** **** ****" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                  <input type="text" id="expiryDate" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-foreground mb-2">CVC</label>
                  <input type="text" id="cvc" placeholder="***" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
          );
        case 'chapa':
        case 'telebirr':
          return (
            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input type="tel" id="phoneNumber" placeholder="e.g., +251 9XX XXX XXX" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                You will be redirected to the {selectedPaymentMethod} app or prompted for a PIN to complete the payment.
              </p>
            </div>
          );
        case 'local-banks':
          return (
            <div className="space-y-4 text-left">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground">
                  To complete your payment, please transfer **{formatPrice(totalPrice)}** to the following bank account.
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                  <li>Bank Name: **Commercial Bank of Ethiopia**</li>
                  <li>Account Name: **EMS Solutions PLC**</li>
                  <li>Account Number: **1000 XXXXXX XXXX**</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  After transfer, you will receive a confirmation message within 24 hours.
                </p>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Complete Your Subscription
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          You're one step away from starting with EMS for {companyName}.
        </p>

        <div className="p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-xl">
          <div className="text-left mb-6">
            <h2 className="text-lg font-semibold text-foreground">Payment Details</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-foreground">
                <span>**Admin Name:**</span>
                <span className="font-semibold">{adminName}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground">
                <span>**Admin Email:**</span>
                <span className="font-semibold">{adminEmail}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground">
                <span>**Company:**</span>
                <span className="font-semibold">{companyName}</span>
              </div>
            </div>
          </div>
          
          <div className="text-left mb-6">
            <h2 className="text-lg font-semibold text-foreground">Select a Payment Method</h2>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === method.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-card/50'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                {method.image ? (
                  <img src={method.image} alt={method.name} className="h-10 w-10 mb-2 rounded-md" />
                ) : (
                  method.icon && <method.icon className="h-10 w-10 mb-2 text-primary" />
                )}
                <span className="text-sm font-medium text-foreground text-center">{method.name}</span>
              </div>
            ))}
          </div>

          {/* Dynamic Payment Form */}
          <div className="text-left mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Total to Pay:</span>
              <span className="text-3xl font-extrabold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Monthly subscription</p>
          </div>

          {renderPaymentForm()}

          {error && (
            <div className="mt-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="mt-8 w-full flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Pay and Subscribe
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Success Page Component
  const SuccessPage: React.FC<{ companyName: string; onRestart: () => void }> = ({ companyName, onRestart }) => {
    return (
      <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Check className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to EMS, {companyName}!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your subscription is now active. You can now access all your selected modules and manage your employees with ease.
        </p>
        <button
          onClick={onRestart}
          className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all hover:bg-primary/90"
        >
          Go to Dashboard (Simulated)
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <>
            <LandingPage onGetStarted={() => setShowSignupModal(true)} />
            {showSignupModal && (
              <SignupModal onSignup={handleSignupSuccess} onClose={() => setShowSignupModal(false)} />
            )}
          </>
        );
      case 'modules':
        return (
          <LandingWithModulesPage
            selectedModules={selectedModules}
            companyName={companyName}
            isLoading={isLoading}
            error={error}
            handleModuleToggle={handleModuleToggle}
            setCompanyName={setCompanyName}
            handleSubscribe={handleSubscribe}
            totalPrice={totalPrice}
            adminName={adminName}
            adminEmail={adminEmail}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            companyName={companyName}
            totalPrice={totalPrice}
            onPaymentSuccess={handlePaymentSuccess}
            adminName={adminName}
            adminEmail={adminEmail}
          />
        );
      case 'success':
        return (
          <SuccessPage
            companyName={companyName}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">EMS</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">Sign In</a>
            </nav>
          </div>
        </div>
      </header>
      
      {renderContent()}
    </div>
  );
}
