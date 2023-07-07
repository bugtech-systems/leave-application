import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


const isWeekend = (date) => {
    const day = date.day();

    return day === 0 || day === 6;
};


const WrappedSingleInputDateRangeField = React.forwardRef((props, ref) => {
    return <SingleInputDateRangeField margin='dense'
        required size="small" {...props} ref={ref} />;
});

WrappedSingleInputDateRangeField.fieldType = 'single-input';


const LeaveForm = ({ value, type, onSubmit, onClose }) => {
    // State variables for form fields and leave balance
    const [employeeName, setEmployeeName] = useState('');
    const [startendDate, setStartEndDate] = useState([dayjs().add(1, 'day'), dayjs().add(1, 'day')]);
    const [errors, setErrors] = useState({});
    // Function to handle form submission

    WrappedSingleInputDateRangeField.defaultProps = { error: errors.startendDate, helperText: errors.startendDate }


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({})
        if (!employeeName) return setErrors(prevValue => { return { ...prevValue, employeeName: 'Field is required!' } })
        if (startendDate && (!startendDate[0] || !startendDate[1])) return setErrors(prevValue => { return { ...prevValue, startendDate: 'Field is required!' } })

        // Process form submission - save leave request, update leave balance, etc.
        // You can use API calls or any other desired method here.
        // Example: Update the leave balance after each leave request
        console.log('SUBMIT', employeeName, startendDate[0], startendDate[1], type === 0 ? 'whole-day' : 'half-day')
        onSubmit(employeeName, startendDate[0], startendDate[1], type === 0 ? 'whole-day' : 'half-day')
    };


    const handleDate = (e) => {
        setStartEndDate(e)
    }

    useEffect(() => {
        if (value) {
            setEmployeeName(value.employeeName)
            setStartEndDate([dayjs(value.startDate), dayjs(value.endDate)])
            setErrors({})
        }
    }, [value])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
                components={['SingleInputDateRangeField']}
            >
                <Box
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                >
                    <Typography variant='body2' style={{ fontWeight: 'bold', margin: 5, paddingLeft: 5, paddingRight: 5 }}>
                        {type === 0 ? 'Whole-Day' : 'Half-Day'} Leave Request Form
                    </Typography>
                    <Divider />

                    <form onSubmit={handleSubmit}
                        style={{ padding: 5 }}
                    >
                        <div
                            style={{ padding: 10, display: 'flex', justifyContent: 'space-around' }}
                        >

                            <DateRangePicker
                                label="Leave start - end Date"
                                disablePast
                                shouldDisableDate={isWeekend}
                                value={startendDate}
                                helperText={errors.startendDate}
                                error={errors.startendDate}
                                onError={() => setErrors({ ...errors, startendDate: 'Field is required' })}
                                onChange={(newValue) => handleDate(newValue)}
                                slots={{ field: WrappedSingleInputDateRangeField }}
                            />
                            <TextField
                                size='small'
                                label="Description"
                                type="text"
                                margin='dense'
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                required
                                error={errors.employeeName}
                                helperText={errors.employeeName}
                            />
                        </div>

                    </form>
                    <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <Button
                            size='sm'
                            onClick={() => onClose()}
                            variant="outlined"
                            style={{ marginRight: 5 }}
                        >
                            CANCEL
                        </Button>
                        <Button
                            size='sm'
                            onClick={handleSubmit}
                            variant='contained'
                            style={{ marginLeft: 5 }}
                        >
                            {value ? 'UPDATE' : 'SAVE'}
                        </Button>
                    </Box>
                </Box >
            </DemoContainer>

        </LocalizationProvider>

    );
};

export default LeaveForm;