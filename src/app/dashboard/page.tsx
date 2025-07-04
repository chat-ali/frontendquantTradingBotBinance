"use client";

import { useState, useEffect } from "react";
import { Button } from "@bot/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bot/components/ui/card";
import { Badge } from "@bot/components/ui/badge";
import { Input } from "@bot/components/ui/input";
import { Label } from "@bot/components/ui/label";
import { Switch } from "@bot/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bot/components/ui/select";
import { Slider } from "@bot/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@bot/components/ui/tabs";
import { Alert, AlertDescription } from "@bot/components/ui/alert";
import {
  Bot,
  Play,
  Square,
  RefreshCw,
  Settings,
  BarChart3,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface Config {
  SIMULATION_MODE: boolean;
  DRY_RUN: boolean;
  RISK_REWARD_RATIO: number;
  MAX_PORTFOLIO_RISK: number;
  TRADE_FEE_RATE: number;
  PRICE_UPDATE_THRESHOLD: number;
  SPREAD_ADJUSTMENT: number;
  DYNAMIC_POSITION_SIZING: boolean;
  LEVERAGE: number;
  TYPE: string;
  TP: number;
  SL: number;
  PAIRS_TO_PROCESS: number;
  SORTBY: string;
  TOTAL_TRADES_OPEN: number;
  MAX_TRADES: number;
}

interface Status {
  running: boolean;
  run_count: number;
  total_trades_open: number;
}

const API_BASE = "https://binancequanttradeengine-production-636e.up.railway.app";

export default function Dashboard() {
  const [config, setConfig] = useState<Config | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const [configRes, statusRes, positionsRes, ordersRes] = await Promise.all(
        [
          fetch(`${API_BASE}/config`),
          fetch(`${API_BASE}/status`),
          fetch(`${API_BASE}/positions`),
          fetch(`${API_BASE}/orders`),
        ]
      );

      if (configRes.ok) setConfig(await configRes.json());
      if (statusRes.ok) setStatus(await statusRes.json());
      if (positionsRes.ok) {
        const posData = await positionsRes.json();
        setPositions(posData.positions || []);
      }
      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        setOrders(orderData.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMessage("Failed to connect to trading bot API");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateConfig = async (key: string, value: any) => {
    try {
      const response = await fetch(`${API_BASE}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (response.ok) {
        setMessage(`${key} updated successfully`);
        fetchData();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail}`);
      }
    } catch (error) {
      setMessage("Failed to update configuration");
    }
  };

  let intervalId: any = null;

  const controlBot = async (action: "start" | "stop") => {
    setLoading(true);
    try {
      if (action === "start") {
        if (intervalId) {
          clearInterval(intervalId);
        }
        // Call start immediately
        const response = await fetch(`${API_BASE}/start`, { method: "POST" });
        if (response.ok) {
          const result = await response.json();
          setMessage(result.message);
          fetchData();
        }
        intervalId = setInterval(async () => {
          await fetch(`${API_BASE}/start`, { method: "POST" });
        }, 10 * 60 * 1000);
      } else if (action === "stop") {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        const response = await fetch(`${API_BASE}/stop`, { method: "POST" });
        if (response.ok) {
          const result = await response.json();
          setMessage(result.message);
          fetchData();
        }
      }
    } catch (error) {
      setMessage(`Failed to ${action} bot`);
    }
    setLoading(false);
  };

  const executeAction = async (action: "refresh" | "run_strategy") => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${action}`, { method: "POST" });
      if (response.ok) {
        setMessage(`${action.replace("_", " ")} executed successfully`);
        fetchData();
      }
    } catch (error) {
      setMessage(`Failed to execute ${action}`);
    }
    setLoading(false);
  };

  if (!config || !status) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">
                BinanceQuantTradingBot
              </span>
            </Link>
            <Badge
              variant={status.running ? "default" : "secondary"}
              className={status.running ? "bg-emerald-600" : "bg-slate-600"}
            >
              {status.running ? "RUNNING" : "STOPPED"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => controlBot(status.running ? "stop" : "start")}
              disabled={loading}
              className={
                status.running
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            >
              {status.running ? (
                <Square className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {status.running ? "Stop Bot" : "Start Bot"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {message && (
          <Alert className="mb-6 border-emerald-600 bg-emerald-600/10">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-400">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Bot Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Activity
                  className={`h-4 w-4 ${
                    status.running ? "text-emerald-400" : "text-slate-400"
                  }`}
                />
                <span className="text-2xl font-bold text-white">
                  {status.running ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Run Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  {status.run_count}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Open Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-2xl font-bold text-white">
                  {status.total_trades_open}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Max Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="text-2xl font-bold text-white">
                  {config.MAX_TRADES}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <Button
            onClick={() => executeAction("refresh")}
            disabled={loading}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-slate-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-slate-700"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Positions
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-slate-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Trading Mode Settings */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Trading Mode</CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure simulation and execution modes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="simulation" className="text-slate-300">
                      Simulation Mode
                    </Label>
                    <Switch
                      id="simulation"
                      checked={config.SIMULATION_MODE}
                      onCheckedChange={(checked) =>
                        updateConfig("SIMULATION_MODE", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dryrun" className="text-slate-300">
                      Dry Run
                    </Label>
                    <Switch
                      id="dryrun"
                      checked={config.DRY_RUN}
                      onCheckedChange={(checked) =>
                        updateConfig("DRY_RUN", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dynamic" className="text-slate-300">
                      Dynamic Position Sizing
                    </Label>
                    <Switch
                      id="dynamic"
                      checked={config.DYNAMIC_POSITION_SIZING}
                      onCheckedChange={(checked) =>
                        updateConfig("DYNAMIC_POSITION_SIZING", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Risk Management */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure risk parameters and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Risk/Reward Ratio: {config.RISK_REWARD_RATIO}
                    </Label>
                    <Slider
                      value={[config.RISK_REWARD_RATIO]}
                      onValueChange={([value]) =>
                        updateConfig("RISK_REWARD_RATIO", value)
                      }
                      min={1.0}
                      max={4.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Max Portfolio Risk: {config.MAX_PORTFOLIO_RISK}
                    </Label>
                    <Slider
                      value={[config.MAX_PORTFOLIO_RISK]}
                      onValueChange={([value]) =>
                        updateConfig("MAX_PORTFOLIO_RISK", value)
                      }
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Take Profit (%): {(config.TP * 100).toFixed(1)}%
                    </Label>
                    <Slider
                      value={[config.TP]}
                      onValueChange={([value]) => updateConfig("TP", value)}
                      min={0.01}
                      max={1.0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Stop Loss (%): {(config.SL * 100).toFixed(1)}%
                    </Label>
                    <Slider
                      value={[config.SL]}
                      onValueChange={([value]) => updateConfig("SL", value)}
                      min={0.01}
                      max={1.0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Trading Parameters */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Trading Parameters
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure leverage and trading limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Leverage: {config.LEVERAGE}x
                    </Label>
                    <Slider
                      value={[config.LEVERAGE]}
                      onValueChange={([value]) =>
                        updateConfig("LEVERAGE", value)
                      }
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Max Trades</Label>
                    <Input
                      type="number"
                      value={config.MAX_TRADES}
                      onChange={(e) =>
                        updateConfig(
                          "MAX_TRADES",
                          Number.parseInt(e.target.value)
                        )
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      min={1}
                      max={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Pairs to Process</Label>
                    <Input
                      type="number"
                      value={config.PAIRS_TO_PROCESS}
                      onChange={(e) =>
                        updateConfig(
                          "PAIRS_TO_PROCESS",
                          Number.parseInt(e.target.value)
                        )
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      min={0}
                      max={150}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Margin Type</Label>
                    <Select
                      value={config.TYPE}
                      onValueChange={(value) => updateConfig("TYPE", value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="CROSSED">Crossed</SelectItem>
                        <SelectItem value="ISOLATED" disabled>
                          Isolated (Not Supported)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Sort By</Label>
                    <Select
                      value={config.SORTBY}
                      onValueChange={(value) => updateConfig("SORTBY", value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Advanced Settings
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Fine-tune trading parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Trade Fee Rate</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={config.TRADE_FEE_RATE}
                      onChange={(e) =>
                        updateConfig(
                          "TRADE_FEE_RATE",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Price Update Threshold
                    </Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={config.PRICE_UPDATE_THRESHOLD}
                      onChange={(e) =>
                        updateConfig(
                          "PRICE_UPDATE_THRESHOLD",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Spread Adjustment</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={config.SPREAD_ADJUSTMENT}
                      onChange={(e) =>
                        updateConfig(
                          "SPREAD_ADJUSTMENT",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Total Trades Open (Read-only)
                    </Label>
                    <Input
                      type="number"
                      value={config.TOTAL_TRADES_OPEN}
                      disabled
                      className="bg-slate-600 border-slate-500 text-slate-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="positions">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Current Positions</CardTitle>
                <CardDescription className="text-slate-400">
                  Active trading positions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={index} className="p-4 bg-slate-700 rounded-lg">
                        <pre className="text-slate-300 text-sm overflow-auto">
                          {JSON.stringify(position, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No active positions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
                <CardDescription className="text-slate-400">
                  Order history and current pending orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={index} className="p-4 bg-slate-700 rounded-lg">
                        <pre className="text-slate-300 text-sm overflow-auto">
                          {JSON.stringify(order, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No recent orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
