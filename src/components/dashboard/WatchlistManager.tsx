
import React, { useState } from "react";
import { Watchlist, useWatchlists } from "@/hooks/use-watchlists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CheckCircle, Edit, Trash, PlusCircle, Settings } from "lucide-react";

interface WatchlistManagerProps {
  onSelectWatchlist: (id: string) => void;
  selectedWatchlistId: string;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  onSelectWatchlist,
  selectedWatchlistId
}) => {
  const {
    watchlists,
    createWatchlist,
    deleteWatchlist,
    renameWatchlist
  } = useWatchlists();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [watchlistToRename, setWatchlistToRename] = useState<Watchlist | null>(null);
  
  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      const id = createWatchlist(newWatchlistName);
      onSelectWatchlist(id);
      setNewWatchlistName("");
      setIsCreateDialogOpen(false);
    }
  };
  
  const handleRenameWatchlist = () => {
    if (watchlistToRename && newWatchlistName.trim()) {
      renameWatchlist(watchlistToRename.id, newWatchlistName);
      setWatchlistToRename(null);
      setNewWatchlistName("");
      setIsRenameDialogOpen(false);
    }
  };
  
  const openRenameDialog = (watchlist: Watchlist) => {
    setWatchlistToRename(watchlist);
    setNewWatchlistName(watchlist.name);
    setIsRenameDialogOpen(true);
  };
  
  const handleDeleteWatchlist = (id: string) => {
    deleteWatchlist(id);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 whitespace-nowrap w-full md:w-auto">
        {watchlists.map((watchlist) => (
          <Button
            key={watchlist.id}
            variant={watchlist.id === selectedWatchlistId ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onSelectWatchlist(watchlist.id)}
          >
            {watchlist.id === selectedWatchlistId && (
              <CheckCircle className="h-3.5 w-3.5" />
            )}
            <span className="truncate max-w-[120px]">{watchlist.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          New
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {watchlists.map((watchlist) => (
              <DropdownMenuItem key={watchlist.id} className="flex justify-between">
                <span className="truncate mr-4">{watchlist.name}</span>
                <div className="flex gap-1">
                  {watchlist.id !== "default" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRenameDialog(watchlist);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWatchlist(watchlist.id);
                        }}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new watchlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Watchlist name"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateWatchlist();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWatchlist}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename watchlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="New name"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameWatchlist();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameWatchlist}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WatchlistManager;
