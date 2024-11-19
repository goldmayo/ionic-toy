"use client"
import { IonItem, IonLabel, IonText } from '@ionic/react';
import React, { createContext, useContext, useId } from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, useFormContext } from 'react-hook-form';

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const Form = useFormContext;

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={`space-y-2 ${className || ''}`} {...props} />
      </FormItemContext.Provider>
    );
  }
);

FormItem.displayName = "FormItem";

interface FormControlProps {
  children: React.ReactElement;
}

export function FormControl({ children }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <IonItem>
      {React.cloneElement(children, {
        id: formItemId,
        'aria-describedby': !error
          ? formDescriptionId
          : `${formDescriptionId} ${formMessageId}`,
        'aria-invalid': !!error,
      })}
    </IonItem>
  );
}

interface FormMessageProps extends Omit<React.ComponentProps<typeof IonText>, 'color'> {
  className?: string;
  children?: React.ReactNode;
}

export const FormMessage = React.forwardRef<HTMLIonTextElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <IonText
        ref={ref}
        color="danger"
        id={formMessageId}
        className={`text-sm font-medium ${className || ''}`}
        {...props}
      >
        <small>{body}</small>
      </IonText>
    );
  }
);

FormMessage.displayName = "FormMessage";

interface FormLabelProps {
  children: React.ReactNode;
}

export function FormLabel({ children }: FormLabelProps) {
  const { error } = useFormField();

  return (
    <IonLabel 
      position="stacked"
      // htmlFor 제거
      className={error ? 'ion-text-danger' : ''}
    >
      {children}
    </IonLabel>
  );
}
export { Form, useFormField };
