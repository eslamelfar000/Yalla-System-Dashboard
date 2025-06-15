import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpdateTeacherStatus } from "@/hooks/useUsers";
import { toast } from "sonner";
import LoadingButton from "../loading-button";

const SwitchStatusDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  isNew,
  onSuccess,
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const updateTeacherMutation = useUpdateTeacherStatus(userId);

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateTeacherMutation.mutateAsync({ is_new: isNew });
    } catch (error) {
    } finally {
      setIsUpdating(false);
      onOpenChange(false);
    }
  };

  console.log(isNew, userId, userName);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isNew ? "set" : "remove"} the "New" status
            for teacher {userName}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
          <LoadingButton
            loading={isUpdating}
            onClick={handleStatusUpdate}
            variant="default"
          >
            {isNew ? "Set as New" : "Remove New Status"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SwitchStatusDialog;
