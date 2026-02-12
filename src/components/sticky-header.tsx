import Image from "next/image";

interface StickyHeaderProps {
  eventName: string;
  eventLocation: string;
  userImage?: string | null;
  children?: React.ReactNode;
}

export function StickyHeader({
  eventName,
  eventLocation,
  userImage,
  children,
}: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="px-5 py-4 w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{eventName}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              {eventLocation}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700">
            {userImage ? (
              <Image
                src={userImage}
                alt="User profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="material-icons text-slate-400 text-lg">person</span>
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
