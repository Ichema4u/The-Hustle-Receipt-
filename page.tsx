"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-32 bg-dark-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-dark-700 sticky top-0 z-40 backdrop-blur-sm bg-dark-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            🎯 The Hustle Receipt
          </Link>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="btn-secondary">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-up">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Turn <span className="gradient-text">Engagement</span> Into{" "}
              <span className="gradient-text">Income</span>
            </h1>
            <p className="text-xl text-dark-300 mb-8 leading-relaxed">
              Get paid by your community. Create a unique tip page and let your
              supporters show their appreciation with real money through
              Flutterwave.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary text-center">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="btn-primary text-center">
                    Get Started Free
                  </Link>
                  <Link href="/login" className="btn-secondary text-center">
                    I Have an Account
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Visual */}
          <div className="relative h-96 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-2xl blur-3xl"></div>
            <div className="relative card h-full flex flex-col justify-center items-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-2">Easy Payments</h3>
              <p className="text-dark-300 text-center">
                Powered by Flutterwave. Support from anyone, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Why Creators Love Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔐",
              title: "Secure",
              description:
                "Server-side payment verification ensures every tip is real",
            },
            {
              icon: "⚡",
              title: "Fast",
              description: "Instant setup. Start receiving tips in minutes",
            },
            {
              icon: "💬",
              title: "Interactive",
              description: "Show off your supporter messages on your dashboard",
            },
          ].map((feature, idx) => (
            <div key={idx} className="card hover:shadow-glow-orange">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-dark-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary-600/20 via-accent-600/20 to-primary-600/20 border border-primary-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to monetize your hustle?
          </h2>
          <p className="text-lg text-dark-300 mb-8">
            Join creators earning money from their supporters right now
          </p>
          {!isAuthenticated && (
            <Link href="/signup" className="btn-primary inline-block">
              Create Your Tip Page
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-dark-400">
          <p>&copy; 2024 The Hustle Receipt. Made with ❤️ for creators.</p>
        </div>
      </footer>
    </main>
  );
}
