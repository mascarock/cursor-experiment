export default function VerifyPage() {
  return (
    <div className="min-h-dvh bg-bg-light dark:bg-bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <span className="material-icons-outlined text-6xl text-primary mb-6 block">
          mark_email_read
        </span>
        <h1 className="text-2xl font-bold mb-3">Check your email</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          A sign in link has been sent to your email address. Click the link to
          complete your sign in.
        </p>
      </div>
    </div>
  );
}
