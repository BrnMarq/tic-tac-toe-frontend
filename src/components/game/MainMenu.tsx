import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "./RoomCard";
import { CreateRoomModal } from "./CreateRoomModal";
import { Room } from "@/types/game";

interface MainMenuProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (roomName: string) => void;
  rooms: Room[]; 
}

export const MainMenu = ({ onJoinRoom, onCreateRoom, rooms }: MainMenuProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = () => {
    console.log('Actualizando lista de salas...');
  };

  const handleCreateRoom = (roomName: string) => {
    onCreateRoom(roomName); 
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Tres en Línea
          </h1>
          <p className="text-muted-foreground text-lg">
            Únete a una sala o crea la tuya propia
          </p>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            variant="game" 
            size="lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Crear Nueva Sala
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-5 h-5" />
            Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onJoin={onJoinRoom} 
            />
          ))}
        </div>
      </div>

      <CreateRoomModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
};