import { Trophy, Frown, Equal, RotateCcw, Home } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WinnerStatus, Player } from "@/types/game";

interface GameResultModalProps {
  isOpen: boolean;
  winner: WinnerStatus;
  playerSymbol: Player;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameResultModal = ({ 
  isOpen, 
  winner, 
  playerSymbol,
  onPlayAgain, 
  onBackToMenu 
}: GameResultModalProps) => {
  const getResultData = () => {
    if (winner === 'draw') {
      return {
        title: '¡Empate!',
        description: 'Ambos jugadores son excelentes',
        icon: Equal,
        color: 'text-accent'
      };
    }
    
    const isWinner = winner === playerSymbol;
    
    return {
      title: isWinner ? '¡Victoria!' : '¡Derrota!',
      description: isWinner 
        ? '¡Felicidades! Has ganado la partida' 
        : 'Mejor suerte la próxima vez',
      icon: isWinner ? Trophy : Frown,
      color: isWinner ? 'text-primary' : 'text-secondary'
    };
  };

  const { title, description, icon: Icon, color } = getResultData();

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icon className={`w-20 h-20 ${color} animate-pulse-glow`} strokeWidth={2} />
          </div>
          <DialogTitle className="text-3xl">{title}</DialogTitle>
          <DialogDescription className="text-lg">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button variant="game" onClick={onPlayAgain} className="w-full">
            <RotateCcw className="w-4 h-4" />
            Jugar de nuevo
          </Button>
          <Button variant="outline" onClick={onBackToMenu} className="w-full">
            <Home className="w-4 h-4" />
            Volver al menú
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
