import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Store, Boxes, ChartColumnBig } from "lucide-react";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllEnterpriseModule]);

interface Store {
  id: number;
  name: string;
}

interface SKU {
  id: number;
  SKU: string;
  Price: number;
  Cost: number;
}

interface RowData {
  storeName: string;
  skuName: string;
  price: number;
  cost: number;
  [key: string]: any; // Dynamic fields for calendar weeks
}

export default function Planning() {
  const navigate = useNavigate();

  const stores = useSelector((state: any) => state.store.stores);
  const skus = useSelector((state: any) => state.sku.skus);

  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    const rows: RowData[] = [];
    stores.forEach((store: Store) => {
      skus.forEach((sku: SKU) => {
        rows.push({
          storeName: store.name,
          skuName: sku.SKU,
          price: sku.Price,
          cost: sku.Cost,
        });
      });
    });
    setRowData(rows);
  }, [stores, skus]);

  // Generate column definitions
  useEffect(() => {
    const calendarColumns: any[] = [];
    const weeksByMonth: Record<string, string[]> = {
      January: ["Week 1", "Week 2", "Week 3", "Week 4"],
      February: ["Week 5", "Week 6", "Week 7", "Week 8"],
    };

    Object.keys(weeksByMonth).forEach((month) => {
      weeksByMonth[month].forEach((week) => {
        calendarColumns.push({
          headerName: `${week} (${month})`,
          children: [
            {
              headerName: "Sales Units",
              field: `${week}_salesUnits`,
              editable: true,
              valueParser: (params: any) => parseInt(params.newValue || "0", 10),
            },
            {
              headerName: "Sales Dollars",
              field: `${week}_salesDollars`,
              valueGetter: (params: any) => {
                const salesUnits = params.data[`${week}_salesUnits`] || 0;
                const price = params.data.price || 0;
                return salesUnits * price;
              },
              valueFormatter: (params: any) => `${params.value?.toFixed(2)}`,
            },
            {
              headerName: "GM Dollars",
              field: `${week}_gmDollars`,
              valueGetter: (params: any) => {
                const salesUnits = params.data[`${week}_salesUnits`] || 0;
                const price = params.data.price || 0;
                const cost = params.data.cost || 0;
                const salesDollars = salesUnits * price;
                return salesDollars - salesUnits * cost;
              },
              valueFormatter: (params: any) => `${params.value?.toFixed(2)}`,
            },
            {
              headerName: "GM %",
              field: `${week}_gmPercentage`,
              valueGetter: (params: any) => {
                const salesUnits = params.data[`${week}_salesUnits`] || 0;
                const price = params.data.price || 0;
                const cost = params.data.cost || 0;
                const salesDollars = salesUnits * price;
                const gmDollars = salesDollars - salesUnits * cost;            
                return salesDollars > 0 ? gmDollars / salesDollars : 0;
              },
              valueFormatter: (params: any) => `${(params.value * 100).toFixed(2)}%`,
              cellStyle: (params: any) => {
                const value = params.value || 0;
                if (value >= 0.4) return { backgroundColor: "green", color: "white" };
                if (value >= 0.1) return { backgroundColor: "yellow", color: "black" };
                if (value >= 0.05) return { backgroundColor: "orange", color: "white" };
                return { backgroundColor: "red", color: "white" };
              },
            }
            
            
          ],
        });
      });
    });

    setColumnDefs([
      { headerName: "Store", field: "storeName", pinned: "left" },
      { headerName: "SKU", field: "skuName", pinned: "left" },
      ...calendarColumns,
    ]);
  }, []);
  

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const exportToCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", height: "200vh" }}>
        <div
          className="shadow-lg shadow-gray-500/70"
          style={{
            backgroundColor: "white",
            color: "black",
            width: "16rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <nav style={{ flex: 1 }}>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", fontSize: "1.5rem" }}>
              <li>
                <Button
                  fullWidth
                  onClick={() => navigate("/")}
                  style={{ justifyContent: "flex-start", color: "black" }}
                >
                  <Store style={{ marginRight: "0.5rem" }} /> Stores
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

        <main style={{ flex: 1, padding: "1rem", backgroundColor: "lightgray" }}>
        <h1 className="text-center text-red-500 text-4xl">TABLE</h1>
          <div style={{ height: "100vh", width: "100%" }}>
          <Button variant="contained" onClick={exportToCsv} style={{ margin: "10px" }}>
              Export to CSV
            </Button>
            <AgGridReact
              className="ag-theme-Alpine"
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                resizable: true,
                sortable: true,
              }}
              onGridReady={onGridReady}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
