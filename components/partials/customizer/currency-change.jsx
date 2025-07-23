import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { initializeDefaultRates } from "@/lib/currency-utils";

function CurrencyChange() {
  const [usdRate, setUsdRate] = useState("49.0898");
  const [ilsRate, setIlsRate] = useState("14.3755");
  const [isSaved, setIsSaved] = useState(false);

  // Load saved rates from localStorage on component mount
  useEffect(() => {
    // Initialize default rates if not set
    initializeDefaultRates();

    // Load current rates
    const savedUsdRate = localStorage.getItem("usd_exchange_rate");
    const savedIlsRate = localStorage.getItem("ils_exchange_rate");

    if (savedUsdRate) setUsdRate(savedUsdRate);
    if (savedIlsRate) setIlsRate(savedIlsRate);
  }, []);

  const handleSave = () => {
    if (usdRate && ilsRate) {
      localStorage.setItem("usd_exchange_rate", usdRate);
      localStorage.setItem("ils_exchange_rate", ilsRate);
      setIsSaved(true);

      // Refresh the page after 1 second to update all components
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleReset = () => {
    setUsdRate("");
    setIlsRate("");
    localStorage.removeItem("usd_exchange_rate");
    localStorage.removeItem("ils_exchange_rate");

    // Refresh the page after clearing rates
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Card className="">
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Currency Exchange Rates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set USD and ILS exchange rates for EGP
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usd-rate" className="flex items-center gap-2">
              <Icon
                icon="mdi:currency-usd"
                className="w-4 h-4 text-green-600"
              />
              USD Rate
            </Label>
            <Input
              id="usd-rate"
              type="number"
              step="0.01"
              placeholder="Enter USD exchange rate"
              value={usdRate}
              onChange={(e) => setUsdRate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ils-rate" className="flex items-center gap-2">
              <Icon icon="mdi:currency-ils" className="w-4 h-4 text-blue-600" />
              ILS Rate
            </Label>
            <Input
              id="ils-rate"
              type="number"
              step="0.01"
              placeholder="Enter ILS exchange rate"
              value={ilsRate}
              onChange={(e) => setIlsRate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={!usdRate || !ilsRate}
            className="flex-1"
          >
            {isSaved ? (
              <div className="flex items-center gap-2">
                <Icon icon="mdi:check" className="w-4 h-4" />
                Saved
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icon icon="mdi:content-save" className="w-4 h-4" />
                Save Rates
              </div>
            )}
          </Button>

          <Button onClick={handleReset} variant="outline" className="flex-1">
            <Icon icon="mdi:refresh" className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CurrencyChange;
