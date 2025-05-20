"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Avatar,
  Button,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { CiSearch, CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import { MdEdit, MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  useDeleteStaffUserMutation,
  useGetAllUsersQuery,
} from "../Redux/features/usersApiSlice";

export default function StaffTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, error, isLoading } = useGetAllUsersQuery();
  const [deleteStaffUser, { isLoading: isDeleting }] =
    useDeleteStaffUserMutation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSmallScreen(window.innerWidth < 930);
      window.addEventListener("resize", () =>
        setIsSmallScreen(window.innerWidth < 930)
      );
      return () =>
        window.removeEventListener("resize", () =>
          setIsSmallScreen(window.innerWidth < 930)
        );
    }
  }, []);

  //  Update `users` state when data changes
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

  //  Log API errors
  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error]);

  //  Optimize Search Filtering
  const filteredUsers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        String(user._id).includes(searchLower)
    );
  }, [searchTerm, users]);

  //  Paginate Results
  const visibleRows = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  //  Handle User Actions
  const handleEdit = (id) => alert(`Edit user with ID: ${id}`);

  // Handle Delete User
  const handleDeleteUser = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteStaffUser(_id);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative", marginTop: "20px" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          backgroundColor: "#FDD05B57",
          color: "#000",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <Toolbar>
          <Typography sx={{ flex: "1 1 100%", color: "#000" }} variant="h6">
            <div className="table-header flex flex-row justify-between w-full">
              <div className="search flex flex-row items-center bg-white px-2 py-1 gap-2 rounded-lg">
                <CiSearch className="icon" />
                <input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 outline-none"
                />
              </div>
              <div className="btns flex flex-row items-center gap-3">
                <button className="filter flex flex-row items-center gap-2 bg-[#67C587] text-white py-2 px-3 rounded-lg">
                  <CiFilter className="icon" />
                  <span>Filter</span>
                </button>
                <button className="sort flex flex-row items-center gap-2 bg-[#67C587] text-white py-2 px-3 rounded-lg">
                  <BiSort className="icon" />
                  <span>Sort</span>
                </button>
              </div>
            </div>
          </Typography>
        </Toolbar>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ color: "red", textAlign: "center", py: 3 }}>
            Failed to load users. Please try again.
          </Typography>
        ) : (
          <TableContainer>
            <Table
              sx={{ minWidth: 750, color: "#000" }}
              aria-labelledby="tableTitle"
            >
              {!isSmallScreen && (
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#000" }}>ID</TableCell>
                    <TableCell sx={{ color: "#000" }}>Name</TableCell>
                    <TableCell align="center" sx={{ color: "#000" }}>
                      Email
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#000" }}>
                      Role
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#000" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map((row) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => router.push(`/dashboard/pages/staff/details?id=${row._id}`)}
                    >
                      <TableCell align="left" sx={{ color: "#000" }}>
                        {row._id || "Loading..."}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          color: "#000",
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <Avatar src={row.image} />
                        {row.name || "Loading..."}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#000" }}>
                        {row.email || "Loading..."}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#000" }}>
                        {row.role || "Loading..."}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleEdit(row._id)}
                          sx={{ color: "#1976D2" }}
                        >
                          <MdEdit size={20} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(row._id)}
                          sx={{ color: "#D32F2F" }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <CircularProgress size={20} />
                          ) : (
                            <MdDelete size={20} />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>
    </Box>
  );
}
