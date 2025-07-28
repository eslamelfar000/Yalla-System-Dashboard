import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import LoadingButton from "../loading-button";
import { useMutate } from "@/hooks/useMutate";
import { useState } from "react";

export function SharedAlertDialog({ type, info, onConfirm, isDeleting }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Mutation for updating reservation status
  const updateReservationStatusMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/reservations/${info?.id}/status`,
    queryKeysToInvalidate: [["reservations", "payafter"]],
    text: "Reservation status updated successfully!",
    onSuccess: () => {
      setIsUpdating(false);
      setIsOpen(false);
    },
    onError: () => {
      setIsUpdating(false);
      setIsOpen(false);
    },
  });

  const handleAcceptReservation = () => {
    if (info?.id) {
      setIsUpdating(true);
      updateReservationStatusMutation.mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {[
          "delete-teacher",
          "delete-quality",
          "delete-paybox-request",
          "delete-after-pay-request",
          "delete-expense",
        ].includes(type) ? (
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="destructive"
            title="Delete"
          >
            <Icon icon="heroicons:trash" className="h-4 w-4" />
          </Button>
        ) : [
            "accept-paybox-request",
            "accept-after-pay-request",
            "accept-patAfter-reservation",
          ].includes(type) ? (
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="success"
            title="Accept"
          >
            <Icon icon="heroicons:check" className="h-4 w-4" />
          </Button>
        ) : (
          ""
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className={"mb-6"}>
          <DialogTitle className="text-2xl text-primary mb-2 flex items-center gap-2">
            <Icon icon="heroicons:shield-exclamation" className="h-10 w-10" />
            {info?.name}
          </DialogTitle>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            {[
              "accept-paybox-request",
              "accept-after-pay-request",
              "accept-patAfter-reservation",
            ].includes(type) ? (
              <span className="text-sm text-default-600">
                This action cannot be undone. This will permanently accept this
                reservation and update its status.
              </span>
            ) : (
              <span className="text-sm text-default-600">
                This action cannot be undone. This will permanently delete this
                item and remove it data from our servers.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button type="submit" variant="outline" color="secondary">
              Close
            </Button>
          </DialogClose>

          {[
            "accept-paybox-request",
            "accept-after-pay-request",
            "accept-patAfter-reservation",
          ].includes(type) ? (
            <LoadingButton
              loading={isUpdating}
              onClick={handleAcceptReservation}
              variant="default"
              color="success"
            >
              {isUpdating ? "Accepting..." : "Accept"}
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={isDeleting}
              onClick={onConfirm}
              variant="default"
              color="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </LoadingButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
