import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { IconCheck, IconTag } from "@tabler/icons-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import AlertButton from "./AlertButton";

function RowManipulation({
  show,
  table,
  setRowSelection,
  refreshData,
  selectedIds,
  session,
}) {
  const supabase = createClientComponentClient();

  // Then, in your delete function, use these IDs.
  async function deleteRows() {
    const { data, error } = await supabase
      .from("virksomheder")
      .delete()
      .in("id", selectedIds)
      .eq("user_id", session.user.id);

    if (error) {
      toast.error("Noget gik galt");
    } else {
      toast.success("Virksomheder slettet");
      setRowSelection([]);
      refreshData();
    }
  }

  return (
    <div
      className={`fixed bottom-8 max-w-7xl w-full flex justify-center fade-in-out ${
        show ? "show" : ""
      }`}
    >
      <Card className=" shadow rounded-md max-w-md w-full">
        <CardContent className="p-4 flex gap-4 items-center justify-between">
          <div className="flex items-center w-full h-fit max-w-[170px] text-sm">
            <Button
              className="mr-2 p-1 h-fit w-fit aspect-square"
              onClick={() => setRowSelection([])}
              variant="outline"
              size="icon"
            >
              <IconCheck className="h-4 w-4" />
            </Button>
            {table.getFilteredSelectedRowModel().rows.length}
            {table.getFilteredSelectedRowModel().rows.length === 1
              ? " række"
              : " rækker"}{" "}
            valgt
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="px-2" size="sm">
              <IconTag className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Exporter
            </Button>

            <AlertButton
              variant="destructive"
              size="sm"
              title="Slet virksomheder"
              description="Er du sikker på, at du vil slette de valgte virksomheder?"
              confirmButtonText="Slet"
              cancelButtonText="Annuller"
              onConfirm={deleteRows}
              buttonText="Slet"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RowManipulation;
