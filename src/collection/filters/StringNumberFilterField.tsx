import { NumberProperty, StringProperty } from "../../models";
import { Field } from "formik";
import {
    FormControl,
    Grid,
    Input,
    MenuItem,
    Select as MuiSelect, TextField,
    Typography
} from "@material-ui/core";
import React, { useState } from "react";
import { FieldProps } from "formik/dist/Field";

interface TextFieldProps {
    name: string,
    property: StringProperty | NumberProperty,
}

export default function StringNumberFilterField({ name, property }: TextFieldProps) {

    const enumValues = property.config?.enumValues;

    return (
        <Field
            name={`${name}`}
        >
            {({
                  field,
                  form: { setFieldValue },
                  ...props
              }: FieldProps) => {

                const [fieldOperation, fieldValue] = field.value ? field.value : ["==", undefined];
                const [operation, setOperation] = useState<string>(fieldOperation);
                const [internalValue, setInternalValue] = useState<string | number>(fieldValue);

                function updateFilter(op: string, val: string | number) {
                    setOperation(op);
                    setInternalValue(internalValue);
                    if (op && val) {
                        setFieldValue(
                            name,
                            [op, val]
                        );
                    } else {
                        setFieldValue(
                            name,
                            undefined
                        );
                    }
                }

                return (

                    <FormControl
                        fullWidth>
                        <Typography variant={"caption"}>
                            {property.title || name}
                        </Typography>
                        <Grid container>

                            <Grid item xs={3}>
                                <MuiSelect value={operation}
                                           autoWidth
                                           variant={"outlined"}
                                           onChange={(evt: any) => {
                                               updateFilter(evt.target.value, internalValue);
                                           }}>
                                    <MenuItem value={"=="}>==</MenuItem>
                                    <MenuItem value={">"}>{">"}</MenuItem>
                                    <MenuItem value={"<"}>{"<"}</MenuItem>
                                    <MenuItem value={">="}>{">="}</MenuItem>
                                    <MenuItem value={"<="}>{"<="}</MenuItem>
                                </MuiSelect>
                            </Grid>

                            {!enumValues && <Grid item xs={9}>
                                <TextField
                                    key={`filter-${name}`}
                                    type={property.dataType === "number" ? "number" : undefined}
                                    defaultValue={internalValue}
                                    variant={"outlined"}
                                    onChange={(evt) => {
                                        const val = property.dataType === "number" ?
                                            parseFloat(evt.target.value)
                                            : evt.target.value;
                                        updateFilter(operation, val);
                                    }}
                                />
                            </Grid>}

                            {enumValues && <Grid item xs={9}>
                                <MuiSelect
                                    fullWidth
                                    key={`filter-${name}`}
                                    variant={"outlined"}
                                    value={internalValue}
                                    onChange={(evt: any) => {
                                        updateFilter(operation, evt.target.value);
                                    }}>
                                    {Object.entries(enumValues).map(([key, value]) => (
                                        <MenuItem key={`select-${key}`}
                                                  value={key}>{value as string}</MenuItem>
                                    ))}
                                </MuiSelect>
                            </Grid>}

                        </Grid>
                    </FormControl>
                );
            }}
        </Field>
    );

}
