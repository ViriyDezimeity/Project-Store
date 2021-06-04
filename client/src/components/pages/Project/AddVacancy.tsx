import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { observer } from 'mobx-react';
import { 
  Button, 
  Container, 
  Grid, 
  TextField, 
} from '@material-ui/core';
import Form from '../../molecules/Form';
import { VacancyCreationAttributes } from 'diploma';
import { useStore } from '../../../helpers/useStore';
import { useForm } from '../../../helpers/useForm';
import { useSnackbar } from 'notistack';
import { ProjectContext } from '../../../stores/Project';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    float: 'right'
  },
}));

interface AddProjectProps {
  onSubmit: (values: VacancyCreationAttributes) => Promise<void>;
  handlePopupClose: () => void;
}

interface IVacancyCreationErrors {
  role: string;
  number: string;
}

const initialFormValues: VacancyCreationAttributes = {
  role: '',
  number: '',
  requirements: '',
};

const initialErrorValues: IVacancyCreationErrors = {
  role: '',
  number: '',
};

const AddVacancy = observer(
  ({ onSubmit, handlePopupClose }: AddProjectProps): JSX.Element => {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    const { getErrorMessage } = useStore(ProjectContext);

    const validate = (): boolean => {
      const fieldValues: VacancyCreationAttributes = values;

      let temp = { ...errors };

      temp.role = fieldValues.role ? '' : 'Это поле обязательно к заполнению';
      if (fieldValues.number) {
        temp.number = Number(fieldValues.number) ? '' : 'Это поле должно быть числом'
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
      errors,
      setErrors,
      handleInputChange,
      resetForm
    } = useForm({
        initialFormValues, 
        initialErrorValues, 
        validate,
      });

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

    return (
      <Container className={classes.root}>
        <Form onSubmit={onFormSubmit}>
          <Grid container>
            <TextField 
              variant='outlined'
              name='role'
              label='Роль *'
              value={values.role}
              onChange={handleInputChange}
              error={!!errors.role}
              helperText={errors.role}
            />
            <TextField 
              variant='outlined'
              name='number'
              label='Необходимое количество человек'
              value={values.number}
              onChange={handleInputChange}
              error={!!errors.number}
              helperText={errors.number}
            />
            <TextField 
              variant='outlined'
              name='requirements'
              label='Требования'
              value={values.requirements}
              onChange={handleInputChange}
            />
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
              onClick={resetForm}
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

export default AddVacancy;
