import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { observer } from 'mobx-react';
import { 
  Button, 
  Container, 
  Grid, 
  TextField, 
} from '@material-ui/core';
import Form from '../../molecules/Form';
import { ProjectCreationAttributes, ProjectDTO } from 'diploma';
import { useForm } from '../../../helpers/useForm';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    float: 'right'
  },
}));

interface AddProjectProps<T> {
  project?: ProjectDTO,
  handlePopupClose: () => void;
  getErrorMessage: () => string | null;
  onSubmit: (values: T) => Promise<void>;
}

interface IProjectCreationErrors {
  title: string;
  description: string;
  customer: string;
  dateBegin: string;
  dateEnd: string;
  controlPoints: string;
  result: string;
  managerId: string;
}

const initialErrorValues: IProjectCreationErrors = {
  title: '',
  description: '',
  customer: '',
  dateBegin: '',
  dateEnd: '',
  controlPoints: '',
  result: '',
  managerId: '',
};

const initialFormValues: ProjectCreationAttributes = {
  id: '',
  title: '',
  description: '',
  customer: '',
  dateBegin: new Date(),
  dateEnd: new Date(),
  controlPoints: '',
  result: '',
};

const AddProject = observer(
  ({ 
    project,
    getErrorMessage,
    onSubmit,
    handlePopupClose 
  }: AddProjectProps<ProjectCreationAttributes>): JSX.Element => {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    const validate = (): boolean => {
      const fieldValues: ProjectCreationAttributes = values;

      let temp = { ...errors };

      temp.title = fieldValues.title ? '' : 'Это поле обязательно к заполнению';
      temp.description = fieldValues.description ? '' : 'Это поле обязательно к заполнению';
      temp.customer = fieldValues.customer ? '' : 'Это поле обязательно к заполнению';
      temp.controlPoints = fieldValues.controlPoints ? '' : 'Это поле обязательно к заполнению';
      temp.dateBegin = fieldValues.dateBegin ? '' : 'Это поле обязательно к заполнению';
      if (fieldValues.dateEnd < fieldValues.dateBegin) {
        temp.dateBegin = 'Дата начала не может быть позже даты окончания';
      }
      temp.dateEnd = fieldValues.dateEnd ? '' : 'Это поле обязательно к заполнению';
      if (fieldValues.dateEnd < fieldValues.dateBegin) {
        temp.dateEnd = 'Дата окончания не может быть раньше даты начала';
      }

      setErrors({
        ...temp
      })

      if (fieldValues === values) {
        return Object.values(temp).every(x => x === '');
      }

      return false;
    }

    const {
      values,
      setValues,
      errors,
      setErrors,
      handleInputChange,
      resetForm
    } = useForm({
        initialFormValues, 
        initialErrorValues, 
        validate,
      });

    useEffect(() => {
      if (project) {
        setValues({
          ...project,
        });
      }
    }, [project]);

    const reset = (): void => {
      if (project) {
        setValues({
          ...project,
        });
        return;
      }
      
      resetForm();
    }

    const onFormSubmit = async (event: React.SyntheticEvent): Promise<void> => {
      event.preventDefault();
      
      if (validate()) {
        await onSubmit(values);

        const errorMessage: string | null = getErrorMessage();
        if (errorMessage) {
          enqueueSnackbar(`Ошибка: ${errorMessage}`, { variant: 'error' });
          return;
        }
        
        handlePopupClose();
      }
    }

    const handleDateBeginChange = (date: Date | null): void => {
      if (date) {
        setValues({
          ...values,
          dateBegin: date
        })
      }
    }

    const handleDateEndChange = (date: Date | null): void => {
      if (date) {
        setValues({
          ...values,
          dateEnd: date
        })
      }
    }

    return (
      <Container className={classes.root}>
        <Form onSubmit={onFormSubmit}>
          <Grid container>
            <TextField 
              variant='outlined'
              name='title'
              label='Название проекта *'
              value={values.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField 
              variant='outlined'
              name='description'
              label='Описание проекта *'
              value={values.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={10}
              rowsMax={20}
            />
            <TextField 
              variant='outlined'
              name='customer'
              label='Заказчик *'
              value={values.customer}
              onChange={handleInputChange}
              error={!!errors.customer}
              helperText={errors.customer}
            />
            <DatePicker
              name='dateBegin'
              animateYearScrolling
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="День начала *"
              value={values.dateBegin}
              onChange={handleDateBeginChange}
              error={!!errors.dateBegin}
              helperText={errors.dateBegin}
            />
            <DatePicker
              name='dateEnd'
              animateYearScrolling
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="День окончания *"
              value={values.dateEnd}
              onChange={handleDateEndChange}
              error={!!errors.dateEnd}
              helperText={errors.dateEnd}
            />
            <TextField 
              variant='outlined'
              name='controlPoints'
              label='Контрольные точки *'
              value={values.controlPoints}
              onChange={handleInputChange}
              error={!!errors.controlPoints}
              helperText={errors.controlPoints}
              multiline
              rows={5}
              rowsMax={10}
            />
            {project &&
              <TextField 
                variant='outlined'
                name='result'
                label='Результат *'
                value={values.result}
                onChange={handleInputChange}
                error={!!errors.result}
                helperText={errors.result}
                multiline
                rows={5}
                rowsMax={10}
              />
            }
            <div className={classes.submit}>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                style={{marginRight: '16px'}}
              >
              Submit
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={reset}
            >
              Reset
            </Button>
          </div>
          </Grid>
        </Form>
      </Container>
    );
  }
);

export default AddProject;
