import Link from "next/link";
import { Button } from "@bot/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bot/components/ui/card";
import { Badge } from "@bot/components/ui/badge";
import {
  ArrowRight,
  BarChart3,
  Bot,
  DollarSign,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">
              TradingBot Pro
            </span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
            Advanced Algorithmic Trading
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Automated Trading
            <span className="text-emerald-400 block">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Professional-grade trading bot with advanced risk management,
            real-time market analysis, and customizable strategies for
            cryptocurrency markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 bg-transparent"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Powerful Trading Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-emerald-400 mb-2" />
                <CardTitle className="text-white">
                  Advanced Algorithms
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Sophisticated trading strategies with dynamic position sizing
                  and risk management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Risk Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Built-in stop-loss, take-profit, and portfolio risk controls
                  to protect your capital
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-400 mb-2" />
                <CardTitle className="text-white">
                  Real-time Execution
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Lightning-fast order execution with real-time market data and
                  price updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">
                  Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Comprehensive analytics with position tracking and performance
                  metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-green-400 mb-2" />
                <CardTitle className="text-white">Multi-Pair Trading</CardTitle>
                <CardDescription className="text-slate-400">
                  Trade multiple cryptocurrency pairs simultaneously with
                  intelligent pair selection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <Bot className="h-10 w-10 text-emerald-400 mb-2" />
                <CardTitle className="text-white">Simulation Mode</CardTitle>
                <CardDescription className="text-slate-400">
                  Test strategies risk-free with paper trading and backtesting
                  capabilities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                24/7
              </div>
              <div className="text-slate-300">Automated Trading</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">150+</div>
              <div className="text-slate-300">Trading Pairs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                100x
              </div>
              <div className="text-slate-300">Max Leverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                0.18%
              </div>
              <div className="text-slate-300">Trading Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Access the full admin dashboard to configure your trading
            parameters, monitor positions, and control your automated trading
            bot.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 text-lg"
            >
              Launch Admin Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-8 px-4">
        <div className="container mx-auto text-center text-slate-400">
          <p>
            &copy; 2024 TradingBot Pro. Advanced algorithmic trading platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
