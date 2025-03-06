import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Store } from 'lucide-react';
import { Boxes } from 'lucide-react';
import { ChartColumnBig } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { addSku, removeSku, updateSku } from '../Redux Toolkit/Slice/skuSlice';

export default function SKU() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ id: 0, SKU: '', Price: '', Cost: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const skus = useSelector((state: any) => state.sku.skus);

  const handleOpen = (index: number | null = null) => {
    setEditIndex(index);
    if (index !== null) {
      setFormData(skus[index]);
    } else {
      setFormData({ id: skus.length + 1, SKU: '', Price: "", Cost: "" });
    }
    setOpen(true);
  };

   const handleClose = () => {
      setFormData({ id: 0, SKU: '', Price: '', Cost: ''  });
      setEditIndex(null);
      setOpen(false);
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (editIndex !== null) {
        dispatch(updateSku(formData));
      } else {
        dispatch(addSku(formData));
      }
      handleClose();
    };
  
    const handleDelete = (id: number) => {
      dispatch(removeSku(id));
    };

  return (
    <div>
      <div style={{ display: "flex", height: "200vh" }}>
        <div className='shadow-lg shadow-gray-500/70' style={{ backgroundColor: "white", color: "black", width: "16rem", display: "flex", flexDirection: "column",}}>
          <nav style={{ flex: 1 }}>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", fontSize: "3rem", color: "black" }}>
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate("/")}
                  style={{ justifyContent: "flex-start", color: "black" }}
                >
                  <Store style={{ marginRight: "0.5rem" }}/> Stores
                </Button>
              </li>
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate("/sku")}
                  style={{ justifyContent: "flex-start", color: "black" }}
                >
                  <Boxes style={{ marginRight: "0.5rem" }} /> SKU
                </Button>
              </li>
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate("/plannings")}
                  style={{ justifyContent: "flex-start", color: "black" }}
                >
                  <ChartColumnBig style={{ marginRight: "0.5rem" }} /> Planning
                </Button>
              </li>
              
            </ul>
          </nav>
        </div>
        <main className="flex-1 bg-gray-200 p-4">
          <Button variant="contained" color="secondary" onClick={() => handleOpen()}>
            NEW SKU
          </Button>
          <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-300">
                  <TableCell sx={{ fontWeight: 'bolder' }}></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skus.map((skus: { id: number; SKU: string; Price: number; Cost: number }, index: number) => (
                  <TableRow key={skus.id}>
                    <TableCell>
                      <Button onClick={() => handleDelete(skus.id)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                    <TableCell>{skus.SKU}</TableCell>
                    <TableCell>${skus.Price}</TableCell>
                    <TableCell>${skus.Cost}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(index)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editIndex !== null ? 'Edit SKU' : 'Add New SKU'}</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="SKU Name"
                  name="SKU"
                  value={formData.SKU}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Price"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Cost"
                  name="Cost"
                  value={formData.Cost}
                  onChange={handleChange}
                  fullWidth
                />
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="secondary" variant="contained">
                    Submit
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
