import React, { useContext, useEffect, useState } from 'react';
import { Master as MasterLayout } from '../layouts';
import { AppContext } from '../../../AppContext';
import * as NavigationUtils from '../../../helpers/Navigation';
import Task from '../../../models/Task';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Typography, TablePagination } from '@material-ui/core';
import { Kanban } from './Kanban';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const List = (props) => {
  const { classes } = props;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const { user: authUser } = useContext(AppContext);
  const { ...childProps } = props;
  const { history } = props;
  const [page, setPage] = useState(0); // Sayfa numarası için state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Sayfa başına gösterilecek kayıt sayısı
  const [total, setTotal] = useState(0); // Toplam sayfa sayısı

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await Task.paginated();
      setTasks(response.data);
        setTotal(response.total);
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    await Task.destroy(id);
    const response = await Task.paginated();
    //TODO: make a function for this
    setTasks(response.data);
    setTotal(response.total);
    };


  const handleChangePage = async (event, newPage) => {
    try {
        console.log("newpage",newPage)
      setLoading(true);
      const response = await Task.paginated({page:newPage+1});
      setTasks(response.data);
      setPage(newPage);
    } catch (error) {
        setMessage({
            type: 'error',
            body: 'An error occurred while fetching tasks.',
        });
    } finally {
        setLoading(false);
    }

  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Sayfa başına gösterim değişirse, tekrar başa dön
  };
  const statuslist=[
    {id:1,name:'pending',value:'pending'},
    {id:2,name:'In Progress',value:'in_progress'},
    {id:3,name:'Completed', value:'completed'},
]
  return (
    <MasterLayout
      {...childProps}
      loading={loading}
      pageTitle="Task List"
      message={message}
    >
      <div>
        <Typography variant="h4" className={classes.title}>
          Task List
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks && tasks.length > 0 ? (
                tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.user.name}</TableCell>
                    <TableCell>

                    <Typography
                        style={{
                        color: task.status === 'completed'
                            ? 'green'
                            : task.status === 'in_progress'
                            ? 'orange'
                            : 'red',
                        fontWeight: 'bold',
                        }}
                    >

                       {statuslist.find(status => status.value === task.status).name}


                    </Typography>

                        </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                            history.push(NavigationUtils.route('backoffice.taskManager.edit', { id: task.id }));
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={deleteTask.bind(this, task.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No data...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
      component="div"
      count={total} // Toplam görev sayısı
      page={page} // Mevcut sayfa numarası
      onChangePage={handleChangePage} // Sayfa değiştiğinde tetiklenir
      rowsPerPage={rowsPerPage} // Sayfa başına gösterilen kayıt sayısı
      onChangeRowsPerPage={handleChangeRowsPerPage} // Sayfa başına kayıt sayısı değiştiğinde tetiklenir
      labelRowsPerPage="Gösterilen Kayıt Sayısı:"
      />
        </Paper>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Yeni görev eklemek için aksiyon
            history.push(NavigationUtils.route('backoffice.taskManager.create'));
          }}
          className={classes.button}
          style={{ marginTop: '20px' }}
        >
         Add New Task
        </Button>
      </div>
      <div>
        <Kanban taskList={tasks}/>
      </div>
    </MasterLayout>
  );
};

export default withStyles(styles)(List);
