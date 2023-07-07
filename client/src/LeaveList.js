import * as React from 'react';
import { List, ListSubheader, Typography, Box, IconButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



export default function LeaveList({ list, onClick }) {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography variant='body2' style={{ fontWeight: 'bold', margin: 5 }}>
                        Leave Requests
                    </Typography>
                </ListSubheader>
            }
        >
            <Divider />
            {list.length === 0 ? <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <Typography variant='body1' style={{ fontWeight: 'bold', margin: 5 }}>
                    No leave request.
                </Typography>
            </Box> :
                list.map(a => {
                    let leaveDate = moment(a.startDate).isSame(moment(a.endDate), 'day');
                    console.log(leaveDate, 'IS SAME?')
                    return <div key={a._id}>
                        <ListItem
                            secondaryAction={
                                <div>
                                    <IconButton edge="end" aria-label="delete"
                                        onClick={() => onClick(a, 'delete')}

                                    >
                                        <DeleteIcon color='error' />
                                    </IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <IconButton edge="end" aria-label="edit"
                                        onClick={() => onClick(a, 'edit')}
                                    >
                                        <EditIcon color='primary' />
                                    </IconButton>
                                </div>
                            }
                        >
                            <ListItemText primary={`${a.employeeName.toUpperCase()} - ${a.leaveType.toUpperCase()}`} secondary={`Leave Date: ${moment(a.startDate).format('ll')} - ${moment(a.endDate).format('ll')}`} />

                        </ListItem>
                        <Divider />
                    </div>
                })
            }
        </List>
    );
}
