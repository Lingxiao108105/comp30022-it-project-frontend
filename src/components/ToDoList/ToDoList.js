import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {
    getAllToDo,
    updateToDo,
    deleteToDo
} from '../../api/ToDoList';

import { toLocalTime } from '../../api/Util';

import AddToDo from './AddToDo';
import UpdateToDo from './UpdateToDo';

// Implement a new toolbar to hold table title and add new to-do button
function EnhancedToolbar(props) {
    const { update } = props;

    // Use state for pop-up
    const [createOpen, setCreateOpen] = useState(false);

    const handleOpen = () => {
        setCreateOpen(true);
    }

    const handleClose = () => {
        setCreateOpen(false);
    }

    return (
        <Toolbar
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
        }}
        >
            <Typography
                sx={{ flex: '1 1 100%', mb: 2 }}
                variant="h6"
                id="ToDoTitle"
                component="div"
            >
                Your To-Do List
            </Typography>
            <IconButton>
                <AddIcon variant="contained" onClick={() => {handleOpen()}}/>
            </IconButton>
            <AddToDo open={createOpen} handleClose={handleClose} update={update}/>
        </Toolbar>
    )
}

// Implement a new table row
function EnhancedTableRow(props) {
    const { row, update } = props;
    const [expand, setExpand] = useState(false);

    // For displaying to-do
    const checkInProgress = (row) =>{
        if (row.status === "to do") {
            // Get the scheduled time of the to-do list
            const scheduledTime = new Date(row.date_time.toString());

            // Get the current time
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const time = today.getHours() + ":" + today.getMinutes();
            const dateTime = date+' '+time;

            const currentTime = new Date(dateTime.toString());

            // Compare the two time
            if (scheduledTime.getTime() <= currentTime.getTime()) {
                return "in progress";
            } else {
                return "to do";
            }
        } else {
            return row.status;
        }

    }

    const getRowLabel = (status) => {
        if (status === "to do") {
            return (<Chip label={status} color="primary" size="small"/>)
        } else if (status === "in progress") {
            return (<Chip label={status} color="warning" size="small"/>)
        } else {
            return (<Chip label={status} color="success" size="small"/>)
        }

    }

    const rowLabel = getRowLabel(checkInProgress(row));
    
    // For deleting to-do
    const handleDelete = (id) => {
        deleteToDo(id).then(() => {
            alert("To-do event deleted");
            update();
        })
    }
    
    // For selecting checkbox
    const isSelected = (status) => {
        if (status === "done") {
            return true;
        }
        return false;
    }
    
    // For displaying if a checkbox is checked
    const [selected, setSelected] = useState(isSelected(row.status))

    const handleClickCheckBox = (event, status) => {
        // Set the to-do status as done
        let statusChange = "done";
        if (status === "done") {
            statusChange = "to do";
        }
        
        const data = {
            "id": row.id,
            "date_time": row.date_time,
            "description": row.description,
            "status": statusChange
        }

        updateToDo(data).then(res => {
            if (res.code === 200) {
                update();
            }
        })
    };

    // For editing to-do
    const [editOpen, setEditOpen] = useState(false);

    const handleEditOpen = () => {
        setEditOpen(true);
    }

    const handleEditClose = () => {
        setEditOpen(false);
    }

    // Update expand and selected everytime the row is updated
    useEffect(() => {
        setExpand(false)
        setSelected(isSelected(row.status))
    }, [row])

    return (
        <React.Fragment>
            <TableRow
                id={row.id}
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.description}
            >
                <TableCell padding="checkbox" style={{borderBottom:"none"}}>
                    <Checkbox
                        color="primary"
                        checked={selected}
                        onClick={(event) => handleClickCheckBox(event, row.status)}
                        // inputProps={{
                        //     'aria-labelledby': labelId,
                        // }}
                    />
                </TableCell>
                <TableCell 
                    component="th"
                    scope="row"
                    padding="none"
                    style={{borderBottom:"none"}}
                    onClick={() => setExpand(!expand)}
                >
                    {row.description}
                </TableCell>
                <TableCell 
                    align="right" 
                    style={{borderBottom:"none"}}
                    onClick={() => setExpand(!expand)}
                >
                    { rowLabel }
                </TableCell>
            </TableRow>
            <TableRow >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                    <Collapse in={expand} timeout="auto" unmountOnExit>
                        <Box >
                            <TableRow >
                                <TableCell 
                                    style={{borderBottom:"none"}}
                                    sx={{ width: '90%' }}
                                >
                                    Date and Time: {toLocalTime(row.date_time)}
                                </TableCell>
                                <TableCell 
                                    style={{borderBottom:"none"}}
                                    sx={{ width: '5%' }}
                                >
                                    <IconButton size="small" onClick={() => {handleEditOpen()}}>
                                        <EditIcon />
                                    </IconButton>
                                    <UpdateToDo original={row} open={editOpen} handleClose={handleEditClose} update={update}/>
                                </TableCell>
                                <TableCell 
                                    style={{borderBottom:"none"}}
                                    sx={{ width: '5%' }}
                                >
                                    <IconButton size="small" onClick={() => {handleDelete(row.id)}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )

}

export default function ToDoList() {
    const [loading, setLoading] = useState(true);
    const [updateCount, setUpdateCount] = useState(0);
    const [rows, setRows] = useState([]);

    const update = () => {
        setTimeout(() => {setUpdateCount(updateCount + 1)}, 1000);
    }

    useEffect(() => {
        getAllToDo().then(res => {
            if (res.code === 200) {
                const data = res.data;
                setRows(data);
            } else {
                alert(res.msg)
            }
        })
    }, [updateCount])

    useEffect(() => {
        setLoading(false);
    }, [rows])

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedToolbar update={update}/>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                    >
                        {rows.map((row) => {
                            return (
                                <EnhancedTableRow row={row} update={update}/>
                            )
                        })}

                    </Table>
                </TableContainer>

                
            </Paper>
        </Grid>
    )
}