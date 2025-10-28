import { X, Circle } from "lucide-react";
import { Player } from "@/types/game";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  board: Player[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  currentPlayer: Player;
  disabled: boolean;
}

export const GameBoard = ({ board, onCellClick, winningLine, currentPlayer, disabled }: GameBoardProps) => {
  const getCellContent = (value: Player, index: number) => {
    if (!value) return null;
    
    const isWinning = winningLine?.includes(index);
    const Icon = value === 'X' ? X : Circle;
    const colorClass = value === 'X' ? 'text-primary' : 'text-secondary';
    
    return (
      <Icon 
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 animate-cell-pop",
          colorClass,
          isWinning && "drop-shadow-[0_0_15px_currentColor]"
        )}
        strokeWidth={3}
      />
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md mx-auto animate-scale-in">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
          className={cn(
            "aspect-square bg-card border-2 border-border rounded-2xl",
            "flex items-center justify-center",
            "transition-all duration-300",
            "hover:bg-muted hover:border-primary hover:scale-105",
            "disabled:cursor-not-allowed disabled:hover:scale-100",
            "active:scale-95",
            cell === null && !disabled && "cursor-pointer",
            winningLine?.includes(index) && "bg-muted border-primary"
          )}
        >
          {getCellContent(cell, index)}
        </button>
      ))}
    </div>
  );
};
