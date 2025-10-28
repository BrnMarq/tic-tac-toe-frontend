import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roomName: string) => void;
}

export const CreateRoomModal = ({ isOpen, onClose, onCreate }: CreateRoomModalProps) => {
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    if (roomName.trim()) {
      onCreate(roomName);
      setRoomName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Crear Nueva Sala</DialogTitle>
          <DialogDescription>
            Ingresa un nombre para tu sala de juego
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Nombre de la sala</Label>
            <Input
              id="roomName"
              placeholder="Mi sala épica"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="game" onClick={handleCreate} disabled={!roomName.trim()}>
            Crear Sala
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
