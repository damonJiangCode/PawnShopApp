const ItemContent: React.FC<{
  items: Item[];
  selectedItemId?: number | null;
  onSelectItem: (id: number) => void;
  onAddItem: () => void;
  onEditItem: (item: Item) => void;
  onRemoveItem: (item: Item) => void;
}> = ({
  items,
  selectedItemId,
  onSelectItem,
  onAddItem,
  onEditItem,
  onRemoveItem,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle1">Items</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Est Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((it) => (
                <TableRow
                  key={it.id}
                  hover
                  selected={it.id === selectedItemId}
                  onClick={() => onSelectItem(it.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{it.id}</TableCell>
                  <TableCell>{it.description}</TableCell>
                  <TableCell>{it.estimated_value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper
          sx={{
            p: 1,
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 简单展示第一个 item 的图片或占位 */}
          {items.length ? (
            <Avatar variant="rounded" sx={{ width: 120, height: 120 }}>
              {/* 可改成 <img src=... /> */}
            </Avatar>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No photo
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid
        item
        xs={2}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Button
            variant="contained"
            onClick={onAddItem}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const it = items.find((i) => i.id === selectedItemId!);
              if (it) onEditItem(it);
            }}
            disabled={!selectedItemId}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              const it = items.find((i) => i.id === selectedItemId!);
              if (it) onRemoveItem(it);
            }}
            disabled={!selectedItemId}
          >
            Remove
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
