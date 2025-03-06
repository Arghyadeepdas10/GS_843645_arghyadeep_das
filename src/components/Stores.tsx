import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Store } from 'lucide-react';
import { Boxes } from 'lucide-react';
import { ChartColumnBig } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { addStore, removeStore, updateStore } from '../Redux Toolkit/Slice/storeSlice';

export default function Stores() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ id: 0, name: '', city: '', state: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stores = useSelector((state: any) => state.store.stores); // Using `any` for state typing.

  const handleOpen = (index: number | null = null) => {
    setEditIndex(index);
    if (index !== null) {
      setFormData(stores[index]);
    } else {
      setFormData({ id: stores.length + 1, name: '', city: '', state: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({ id: 0, name: '', city: '', state: '' });
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
      dispatch(updateStore({ id: formData.id, newName: formData.name }));
    } else {
      dispatch(addStore(formData));
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    dispatch(removeStore(id));
  };

  return (
    <div>
      <div style={{ display: 'flex', height: '200vh' }}>
        <div
          className="shadow-lg shadow-gray-500/70"
          style={{
            backgroundColor: 'white',
            color: 'black',
            width: '16rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <nav style={{ flex: 1 }}>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: '1rem',
                fontSize: '3rem',
                color: 'black',
              }}
            >
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate('/')}
                  style={{ justifyContent: 'flex-start', color: 'black' }}
                >
                  <Store style={{ marginRight: '0.5rem' }} /> Stores
                </Button>
              </li>
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate('/sku')}
                  style={{ justifyContent: 'flex-start', color: 'black' }}
                >
                  <Boxes style={{ marginRight: '0.5rem' }} /> SKU
                </Button>
              </li>
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate('/plannings')}
                  style={{ justifyContent: 'flex-start', color: 'black' }}
                >
                  <ChartColumnBig style={{ marginRight: '0.5rem' }} /> Planning
                </Button>
              </li>
            </ul>
          </nav>
        </div>
        <main className="flex-1 bg-gray-200 p-4">
          <Button variant="contained" color="secondary" onClick={() => handleOpen()}>
            NEW STORE
          </Button>
          <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-300">
                  <TableCell sx={{ fontWeight: 'bolder' }}></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>STORE</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CITY</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>STATE</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store: { id: number; name: string; city: string; state: string }, index: number) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <Button onClick={() => handleDelete(store.id)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.city}</TableCell>
                    <TableCell>{store.state}</TableCell>
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
            <DialogTitle>{editIndex !== null ? 'Edit Store' : 'Add New Store'}</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Store Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="State"
                  name="state"
                  value={formData.state}
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
  );
}
