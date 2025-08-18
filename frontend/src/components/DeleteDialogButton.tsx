// components/DeleteDialogButton.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteDialogButtonProps {
  id: string;
  onConfirm: () => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

export const DeleteDialogButton = ({
  id,
  onConfirm,
  isDeleting = false,
  disabled = false,
}: DeleteDialogButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          disabled={disabled}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer"
          title="Hapus Prediksi"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black text-pink-400 border border-pink-400 rounded-lg shadow-lg ">
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border border-pink-400 rounded-lg shadow-lg cursor-pointer">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? "Menghapus..." : "Lanjutkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
