import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Grid, Card, CardContent, Typography, CssBaseline,
  Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";

function Dashboard() {
  const baseurl = "https://localhost:7241/api/dashboard";

  const [data, setData] = useState({
    totalErrors: 0,
    errorsByLanguage: [],
    errorsByProject: [],
    topExceptions: [],
    recentErrors: []
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#9c27b0"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          totalRes,
          langRes,
          projRes,
          topRes,
          recentRes
        ] = await Promise.all([
          axios.get(`${baseurl}/total-errors`),
          axios.get(`${baseurl}/errors-by-language`),
          axios.get(`${baseurl}/errors-by-project`),
          axios.get(`${baseurl}/top-exceptions`),
          axios.get(`${baseurl}/recent-errors`)
        ]);

        setData({
          totalErrors: totalRes.data,
          errorsByLanguage: langRes.data,
          errorsByProject: projRes.data,
          topExceptions: topRes.data.slice(0, 5),
          recentErrors: recentRes.data.slice(0, 5)
        });
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <Box sx={{ height: "100vh", p: 2, bgcolor: "#f4f6f8" }}>
      <CssBaseline />

      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Error Dashboard
      </Typography>

      {/* 🔥 FLEX CONTAINER (IMPORTANT) */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >

        {/* 🔥 TOP ROW (3 CARDS - 40% WIDTH) */}

        {/* Total Errors */}
        <Grid item xs={12} sx={{ flexBasis: "40%", maxWidth: "13%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2">Total Errors</Typography>
              <Typography variant="h3" color="error">
                {data.totalErrors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Language Chart */}
        <Grid item xs={12} sx={{ flexBasis: "40%", maxWidth: "40%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Errors by Language
              </Typography>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.errorsByLanguage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="language" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count">
                      {data.errorsByLanguage.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Pie Chart */}
        <Grid item xs={12} sx={{ flexBasis: "40%", maxWidth: "40%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Errors by Project
              </Typography>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.errorsByProject}
                      dataKey="count"
                      nameKey="project"
                      outerRadius={110}
                      activeIndex={activeIndex}
                      onMouseEnter={onPieEnter}
                      label={({ project, percent }) =>
                        `${project} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.errorsByProject.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 🔥 BOTTOM ROW (2 CARDS - 50% WIDTH) */}

        {/* Top Exceptions */}
        <Grid item xs={12} sx={{ flexBasis: "48%", maxWidth: "48%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Top Exceptions
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Exception</b></TableCell>
                    <TableCell align="center"><b>Count</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topExceptions.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.exception}</TableCell>
                      <TableCell align="center">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Errors */}
        <Grid item xs={12} sx={{ flexBasis: "48%", maxWidth: "48%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Recent Errors
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Project</b></TableCell>
                    <TableCell><b>Exception</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.recentErrors.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.project}</TableCell>
                      <TableCell>{item.exception}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Dashboard;