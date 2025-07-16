import { Bell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const TopNav = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-30 h-16 bg-card border-b border-border px-4 md:px-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
      {/* Search: left on desktop, right on mobile */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Notifications + Profile */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
  <Bell className="w-5 h-5" />
  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
</button>


        <div className="hidden md:flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.department}</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
