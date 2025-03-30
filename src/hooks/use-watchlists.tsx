
import { useState, useEffect } from "react";
import { stockData } from "@/lib/data";

export type Watchlist = {
  id: string;
  name: string;
  stocks: string[]; // Array of stock symbols
};

export function useWatchlists() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(() => {
    const saved = localStorage.getItem("watchlists");
    if (saved) {
      return JSON.parse(saved);
    }
    // Default watchlist with all stocks
    return [
      { 
        id: "default", 
        name: "All Stocks", 
        stocks: stockData.map(stock => stock.symbol) 
      }
    ];
  });
  
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>(() => {
    const saved = localStorage.getItem("activeWatchlistId");
    return saved || "default";
  });

  useEffect(() => {
    localStorage.setItem("watchlists", JSON.stringify(watchlists));
  }, [watchlists]);

  useEffect(() => {
    localStorage.setItem("activeWatchlistId", activeWatchlistId);
  }, [activeWatchlistId]);

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];

  const createWatchlist = (name: string) => {
    const newWatchlist = {
      id: Date.now().toString(),
      name,
      stocks: []
    };
    setWatchlists([...watchlists, newWatchlist]);
    return newWatchlist.id;
  };

  const deleteWatchlist = (id: string) => {
    // Don't allow deleting the default watchlist
    if (id === "default") return;
    
    setWatchlists(watchlists.filter(w => w.id !== id));
    
    // If we deleted the active watchlist, select the default one
    if (id === activeWatchlistId) {
      setActiveWatchlistId("default");
    }
  };

  const renameWatchlist = (id: string, newName: string) => {
    setWatchlists(
      watchlists.map(w => 
        w.id === id ? { ...w, name: newName } : w
      )
    );
  };

  const addToWatchlist = (watchlistId: string, symbol: string) => {
    setWatchlists(
      watchlists.map(w => 
        w.id === watchlistId && !w.stocks.includes(symbol)
          ? { ...w, stocks: [...w.stocks, symbol] }
          : w
      )
    );
  };

  const removeFromWatchlist = (watchlistId: string, symbol: string) => {
    setWatchlists(
      watchlists.map(w => 
        w.id === watchlistId
          ? { ...w, stocks: w.stocks.filter(s => s !== symbol) }
          : w
      )
    );
  };

  return {
    watchlists,
    activeWatchlist,
    setActiveWatchlistId,
    createWatchlist,
    deleteWatchlist,
    renameWatchlist,
    addToWatchlist,
    removeFromWatchlist
  };
}
