"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddOrEditModel from "./AddOrEditModel";

const AddingDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus size={16} /> Add Model
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Add your model details</DialogTitle>
            <DialogDescription>
              Insert the details for your new model below.
            </DialogDescription>
          </DialogHeader>
          <AddOrEditModel />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddingDialog;
