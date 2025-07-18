// TODO UNUSED COMMPONENT
export function ConfirmDeletion<T extends { id: number | string }>(
  row: T,
  deleteApiFunc: (id: T["id"]) => Promise<void>,
  onRefresh: () => void
): () => void {
  return () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete item with id: ${row.id}?`
    );
    if (confirmed) {
      deleteApiFunc(row.id)
        .then(() => {
          alert("Item deleted successfully");
          onRefresh();
        })
        .catch(() => {
          alert("Error deleting item.");
        });
    }
  };
}
