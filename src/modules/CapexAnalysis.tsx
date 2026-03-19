import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputLabel
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { dashboardService } from "../services/dashboardService";
import { callToAction } from "../services/whatsapp.service";

export default function CapexAnalysis({ month, year }: { month: number; year: number }) {
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<'zonal' | 'unit'>('zonal');
  const [zonalData, setZonalData] = useState<any[]>([]);
  const [unitData, setUnitData] = useState<any[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  // Extract unique divisions (AU) from unitData for the dropdown
  const uniqueDivisions = React.useMemo(() => {
    const dus = unitData
      .map(item => item.au)
      .filter((au): au is string => !!au);
    return ['All', ...Array.from(new Set(dus))];
  }, [unitData]);

  const filteredUnitData = React.useMemo(() => {
    if (selectedDivision === 'All') return unitData;
    return unitData.filter(item => item.au === selectedDivision || (!item.au && (item.planheadname === 'TOTAL' || item.planheadname === 'Total')));
  }, [unitData, selectedDivision]);

  const fetchCapexData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getCapexData();

      // Custom alphanumeric sorter logic
      const sortByIndex = (a: any, b: any) => {
        const indexA = a.index;
        const indexB = b.index;

        // Push missing/falsy indexes to the bottom
        if (!indexA && !indexB) return 0;
        if (!indexA) return 1;
        if (!indexB) return -1;

        // If they're numbers, sort them numerically rather than alphabetically
        const numA = parseInt(String(indexA), 10);
        const numB = parseInt(String(indexB), 10);

        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        // Fallback to string behavior if neither are numeric, taking case into account
        return String(indexA).localeCompare(String(indexB), undefined, { numeric: true, sensitivity: 'base' });
      };

      const zonalData = response.zonalData || [];
      zonalData.sort(sortByIndex);
      console.log("zonalData", zonalData);

      const unitData = response.unitData || [];
      unitData.sort(sortByIndex);
      console.log("unitData", unitData);

      if (response) {
        setZonalData(zonalData);
        setUnitData(unitData);
      }
    } catch (error) {
      console.error(`Failed to fetch capex data:`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapexData();
  }, [fetchCapexData]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleZonalWhatsappClick = async (row: any) => {
    try {
      const title = `📉 PFA Portal Alert – CAPEX Utilization (Zonal)`;
      const message = `Utilization in ${row.planheadname} is below the internal target.\nKindly prepare an action plan to improve CAPEX utilization under ${row.planheadname} and ensure progress towards the target.\n\nDetails:\nPH No: ${row.planheadno || '-'}\nRBG Total: ${Number(row.rgbtotal || 0).toFixed(2)}\nActual Upto Month: ${Number(row.actualforthemonthlastyeartotal || 0).toFixed(2)}\nUtilization: ${Number(row.actualuptothemonthtotal || 0).toFixed(2)}%`;
      await callToAction(["Dy. FA&CAO/B&B"], title, message);
      alert(`Task created successfully for ${row.planheadname}!`);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleUnitWhatsappClick = async (row: any) => {
    try {
      const title = `📉 PFA Portal Alert – CAPEX Utilization (Unit)`;
      const message = `Utilization in ${row.planheadname} is below the internal target.\nPlease prepare an action plan to increase CAPEX utilization under ${row.planheadname} and improve expenditure progress.\n\nDetails:\nUnit: ${row.au || 'Zonal Total'}\nGrant (RG): ${row.rglastyear}\nActual For Month: ${row.actualforthemonth}\n% Utilization: ${Number(row.percentageutilization).toFixed(2)}%`;
      await callToAction(["Sr. DFM (Unit)"], title, message);
      alert(`Task created successfully for ${row.planheadname}!`);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>CAPEX Analysis</Typography>
            <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
          </Box>

          {viewType === 'unit' && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="division-select-label" sx={{ fontSize: '13px' }}>Select Division</InputLabel>
              <Select
                labelId="division-select-label"
                id="division-select"
                value={selectedDivision}
                label="Select Division"
                onChange={(e) => setSelectedDivision(e.target.value)}
                sx={{
                  fontSize: '13px',
                  borderRadius: '8px',
                  bgcolor: 'white'
                }}
              >
                {uniqueDivisions.map(div => (
                  <MenuItem key={div} value={div} sx={{ fontSize: '13px' }}>{div}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={(e, next) => next && setViewType(next)}
          size="small"
          sx={{ bgcolor: "white" }}
        >
          <ToggleButton value="zonal" sx={{ textTransform: 'none', px: 2 }}>Zonal Data</ToggleButton>
          <ToggleButton value="unit" sx={{ textTransform: 'none', px: 2 }}>Unit Data</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <CircularProgress />
        </Box>
      ) : viewType === 'zonal' ? (
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', borderRadius: 2, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {/* <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>#</TableCell> */}
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>PH No</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Planhead Name</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>RBG Total</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Actual Upto Month Total</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Utilization Total</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px', width: '40px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zonalData.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}>No zonal data available</TableCell></TableRow>
              ) : zonalData.map((row, idx) => (

                <TableRow key={row.uuid || idx} hover sx={{
                  bgcolor: (row.planheadname === 'Total' || row.planheadname === 'TOTAL' || row.planheadname === 'Grand Total') ? '#F1F5F9' : 'inherit'
                }}>
                  {/* <TableCell sx={{ fontSize: '11px' }}>{row.index}</TableCell> */}
                  <TableCell sx={{ fontSize: '11px' }}>{row.planheadno || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: (row.planheadname === 'Total' || row.planheadname === 'TOTAL' || row.planheadname === 'Grand Total') ? 700 : 600 }}>
                    {row.planheadname}
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>{`${Number(row.rgbtotal || 0).toFixed(2)}${row.figure}`}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>{`${Number(row.actualuptothemonthtotal || 0).toFixed(2)}${row.figure}`}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    <Chip
                      label={`${Number(row.utilizationoftotal || 0).toFixed(2)}%`}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        height: 20,
                        bgcolor: Number(row.utilizationoftotal) < 60 ? '#FEF2F2' : '#F0FDF4',
                        color: Number(row.utilizationoftotal) < 60 ? '#991B1B' : '#166534',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }} align="center">
                    <IconButton size="small" sx={{ color: "#25D366" }} onClick={() => handleZonalWhatsappClick(row)}>
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', borderRadius: 2, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {/* <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>#</TableCell> */}
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Unit (AU)</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>PlanHead Name</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Grant (RG)</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Actual For Month</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>Actual To End (LY)</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px' }}>% Utilization</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC', fontSize: '11px', width: '40px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUnitData.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}>No unit data available</TableCell></TableRow>
              ) : filteredUnitData.map((row, idx) => (
                <TableRow key={row.uuid || idx} hover sx={{
                  bgcolor: (!row.au && (row.planheadname === 'TOTAL' || row.planheadname === 'Total')) ? '#F8FAFC' : 'inherit'
                }}>
                  {/* <TableCell sx={{ fontSize: '11px' }}>{row.index}</TableCell> */}
                  <TableCell sx={{ fontSize: '11px' }}>{row.au || 'Zonal Total'}</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600 }}>{row.planheadname}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>{row.rglastyear}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>{row.actualforthemonth}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>{row.actualtotheendoflastyear}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    <Chip
                      label={`${Number(row.percentageutilization).toFixed(2)}%`}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        height: 20,
                        bgcolor: Number(row.percentageutilization) < 60 ? '#FEF2F2' : '#F0FDF4',
                        color: Number(row.percentageutilization) < 60 ? '#991B1B' : '#166534'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }} align="center">
                    <IconButton size="small" sx={{ color: "#25D366" }} onClick={() => handleUnitWhatsappClick(row)}>
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
