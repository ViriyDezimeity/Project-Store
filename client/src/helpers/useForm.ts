import React, { useState } from "react";

interface IUseForm<T, U> {
  initialFormValues: T,
  initialErrorValues: U,
  validate: () => boolean,
}

interface IUseFormReturn<T, U> {
  values: T,
  setValues: React.Dispatch<T>,
  errors: U,
  setErrors: React.Dispatch<U>,
  resetForm: () => void,
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }>) => void,
};

export function useForm<T, U>({
  initialFormValues,
  initialErrorValues,
  validate,
}: IUseForm<T, U>): IUseFormReturn<T, U> {
  // Form Values
  const [values, setValues] = useState<T>(initialFormValues);
  // Error Values
  const [errors, setErrors] = useState<U>(initialErrorValues);
  
  // Resetting the form
  const resetForm = (): void => {
    setValues(initialFormValues);
    setErrors(initialErrorValues);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }>): void => {
    // Getting the value from event
    const { name, value } = event.target;

    // Set the modified value
    if (name) {
      setValues({
        ...values,
        [name]: value,
      });
    }
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    resetForm,
    handleInputChange,
  }
}