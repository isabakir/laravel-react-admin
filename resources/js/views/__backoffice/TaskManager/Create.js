import React, { useEffect, useState } from 'react'
import {
    Button,
    Grid,
    MenuItem,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    withStyles,
} from '@material-ui/core';

import * as NavigationUtils from '../../../helpers/Navigation';
import { User } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import { Profile, Account, Avatar } from './Forms';
import { DatePicker,MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import Task from '../../../models/Task';
const Create = (props) => {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState([]);
    const [userList, setUserList] = useState([]);
    const [message, setMessage] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const { history } = props;
    const handleSubmit = (e) => {
      e.preventDefault();
      setStartDate(moment(startDate).format('YYYY-MM-DD'));
        setEndDate(moment(endDate).format('YYYY-MM-DD'));
      const taskData = {
        title,
        description,
        assignedTo,
        startDate,
        endDate,
      };
      onSave(taskData); // save task
    };

    const onSave = async (taskData) => {

        setLoading(true);
        const response = await Task.store(taskData);
        setLoading(false);
        console.log("response", response.status);
        if (response.status == 201) {
            setMessage({
                type: 'success',
                body: 'Task created successfully.',
            });
            history.push(
            NavigationUtils.route('backoffice.taskManager.index'),
        );
        } else {
            setMessage({
                type: 'error',
                body: 'Task creation failed.',
            });

        }
    };

    //get user list
    const fetchUsers = async () => {
        const response = await User.paginated();
        console.log("response userlist", response);
        setUserList(response.data);
    };
    useEffect(() => {
        fetchUsers();
    }, []);





    const { classes, ...other } = props;




    const renderForm = () => {
        const defaultProfileValues = {
            title: '',
            description: '',
            assignedTo: '',
            startDate: null,
            endDate: null,

        };


    };

    return (
        <MasterLayout
            {...other}
            pageTitle="Add New Task"
            tabs={[]}
            message={message}
        >
            <div className={classes.pageContentWrapper}>
                {loading && <LinearIndeterminate />}

                <Paper>
                    <div className={classes.pageContent}>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            gutterBottom
                        >
                            Add New Task
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={8} direction='column'>
                                <Grid item xs={12}>
                                <Typography variant="h5">Create Task </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    label="Assigned To"
                                    variant="outlined"
                                    select
                                    fullWidth
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    required
                                >
                                    {userList.map((key) => (
                                        <MenuItem key={key.id} value={key.id}>
                                          {key.name}
                                        </MenuItem>
                                    ))}

                                </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(moment(newValue).format('YYYY-MM-DD'))}
                                    fullWidth
                                    required
                                    />
                                </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(moment(newValue).format('YYYY-MM-DD'))}
                                    fullWidth
                                    required
                                    />
                                </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Kaydet
                                </Button>
                                </Grid>
                            </Grid>
                        </form>



                    </div>
                </Paper>
            </div>
        </MasterLayout>
    );
}

const styles = theme => ({
    pageContentWrapper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        minHeight: '75vh',
        overflowX: 'auto',
    },

    pageContent: {
        padding: theme.spacing.unit * 3,
    },
});

export default withStyles(styles)(Create);
