import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WaitingRoomProps {
  roomName: string;
  onLeave: () => void;
}

export const WaitingRoom = ({ roomName, onLeave }: WaitingRoomProps) => {
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-8 animate-fade-in">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">
            {roomName}
          </CardTitle>
          <CardDescription className="text-lg">
            Esperando otro jugador...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </div>
          <p className="text-center text-muted-foreground">
            La partida comenzará automáticamente cuando otro jugador se una
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onLeave}
          >
            <LogOut className="w-4 h-4" />
            Salir de la sala
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
