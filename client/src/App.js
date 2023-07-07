import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CalendarIcon from './calendar.png';
import { Button, IconButton } from '@mui/material';
import commonData from './env.json';
import LeaveList from './LeaveList';
import ApplyButton from './ButtonGroup';
import LeaveForm from './LeaveForm';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://bugtech.solutions">
        Bugtech.solutions
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Checkout() {
  const [addRecord, setAddRecord] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [leaveBalance, setLeaveBalance] = React.useState(22);
  const [list, setList] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleOpen = (e) => {
    setAddRecord(true)
    setSelectedItem(null)
  }

  const handleClose = () => {
    setAddRecord(false)
    setSelectedItem(null)
  }


  const handleSelect = (e, type) => {
    setSelectedItem(e)
    if (type === 'edit') {
      setAddRecord(true);
    }
    if (type === 'delete') {
      axios.delete(`${commonData.apiUrl}/api/leaves/${e._id}`)
        .then(({ data }) => {
          handleGetList()
          setSelectedItem(null)
        })
        .catch(err => {
          console.log(err)
          // setAddRecord(false)
        })
    }
  }

  const handleGetList = () => {
    axios.get(`${commonData.apiUrl}/api/leaves`)
      .then(({ data }) => {
        let totalLeaves = data.map(a => { return a.duration }).reduce((a, b) => a + b, 0)
        setLeaveBalance(22 - totalLeaves)
        setList(data)
      })
      .catch(err => {
        console.log(err)
      })

  }




  // Function to calculate leave duration excluding weekends
  const calculateLeaveDuration = (start, end, type) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    let duration = 0;

    if (type === 'half-day') {
      while (startDateObj <= endDateObj) {
        const dayOfWeek = startDateObj.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          duration += 0.5;
        }
        startDateObj.setDate(startDateObj.getDate() + 1);
      }
    } else if (type === 'whole-day') {
      while (startDateObj <= endDateObj) {
        const dayOfWeek = startDateObj.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          duration++;
        }
        startDateObj.setDate(startDateObj.getDate() + 1);
      }
    }


    return duration;
  };



  const handleSubmit = (employeeName, startDate, endDate, leaveType) => {

    const leaveDuration = calculateLeaveDuration(startDate, endDate, leaveType);
    const updatedLeaveBalance = leaveBalance - leaveDuration;
    console.log('DURATION', leaveDuration)
    setLeaveBalance(updatedLeaveBalance);
    if (selectedItem && leaveDuration !== 0) {
      axios.put(`${commonData.apiUrl}/api/leaves/${selectedItem._id}`, { employeeName, startDate, endDate, leaveType, duration: leaveDuration })
        .then(({ data }) => {
          console.log('RESPONSE', data)
          handleGetList()
          setAddRecord(false)
          setSelectedItem(null)
        })
        .catch(err => {
          console.log(err)
          setAddRecord(false)

        })

    } else {

      axios.post(`${commonData.apiUrl}/api/leaves`, { employeeName, startDate, endDate, leaveType, duration: leaveDuration })
        .then(({ data }) => {
          console.log('RESPONSE', data)
          handleGetList()
          setAddRecord(false)
          setSelectedItem(null)
        })
        .catch(err => {
          console.log(err)
          setAddRecord(false)

        })

    }


  }



  React.useEffect(() => {

    handleGetList()
  }, [])


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar
          style={{ justifyContent: 'space-between' }}
        >
          <Typography variant="h5" color="inherit" noWrap style={{ fontWeight: 'bold' }}>
            Leave Application
          </Typography>
          <IconButton
            component={Link}
            href={commonData.shareableLink}
            target='_blank'
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >

            <img src={CalendarIcon} height={30} width={30} />
            <Typography variant='caption'>View Calendar</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Box style={{ marginBottom: 5, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 5 }}
          >
            <Typography variant='body2' style={{ lineHeight: 1 }} >LEAVE CREDITS: {leaveBalance + 2}</Typography>
            <Typography variant='caption' style={{ lineHeight: 1 }} >(pro-rated): {leaveBalance}</Typography>
          </div>
          {!addRecord || (addRecord && selectedItem) ?
            <ApplyButton
              disabled={selectedItem}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              onClick={(e) => handleOpen(e)}
            />
            :
            null
          }

        </Box>

        <Paper variant="outlined">
          {addRecord ?
            <LeaveForm value={selectedItem} type={selectedIndex} onSubmit={handleSubmit} onClose={() => handleClose()} />
            :
            <LeaveList list={list} onClick={handleSelect} />
          }

        </Paper>
        <br /><br />
        <Copyright />
      </Container>
    </ThemeProvider >
  );
}