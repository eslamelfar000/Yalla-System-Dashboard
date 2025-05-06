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

export function SharedAlertDialog({ type, info }) {
  console.log("info", info);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {[
          "delete-teacher",
          "delete-quality",
          "delete-paybox-request",
          "delete-after-pay-request",
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
        ) : ["accept-paybox-request", "accept-after-pay-request"].includes(
            type
          ) ? (
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
            {["accept-paybox-request", "accept-after-pay-request"].includes(
              type
            ) ? (
              <span className="text-sm text-default-600">
                This action cannot be undone. This will permanently accept this
                request?
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

          {["accept-paybox-request", "accept-after-pay-request"].includes(
            type
          ) ? (
            <Button type="submit" color="success">
              Accept
            </Button>
          ) : (
            <Button type="submit" color="destructive">
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
